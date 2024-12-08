const multer = require("multer");
const { validateVideoDuration, getFileMetaData, cutVideo, mergeVideos, sendVideo } = require("../utils/video");
const { In } = require("typeorm");
const { VideoTable, PublicLinksTable } = require("../db/tables");
const { appDataSource } = require("../db");
const { PublicLinks } = require("../db/models");

const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const filePath = req.file.path;
        const size = req.file.size;
        const fileName = req.file.originalname;

        const durationValidation = await validateVideoDuration(filePath);
        if (durationValidation.error) {
            return res.status(400).json({ error: durationValidation.error });
        }

        const duration = durationValidation.duration;

        const video = VideoTable.create({ name: fileName, size, duration, path: filePath, user: req.user.id });
        await VideoTable.save(video);

        res.status(201).json({
            message: 'Video uploaded successfully',
            video: video,
        });

    } catch (error) {
        console.log(error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ message: error.message });
    }

}



const trimVideo = async (req, res, next) => {
    try {
        const { start = 0, end } = req.body;
        const { id } = req.params;

        const video = await VideoTable.findOneBy({ id: id, user: req.user.id });

        if (!video || video.user !== req.user.id) {
            return res.status(404).json({ error: 'Video not found' });
        }

        if (start >= video.duration) {
            return res.status(400).json({ error: 'Invalid start time. It must be within the video duration' });
        }
        else if (end > video.duration) {
            return res.status(400).json({ error: 'Invalid end time. It must be greater than start time and within the video duration' });
        }

        const trimmedVideoMeta = await cutVideo(video.path, start, end);
        const { duration, size } = await getFileMetaData(trimmedVideoMeta.path);

        const trimmedVideo = VideoTable.create({
            name: trimmedVideoMeta.file_name,
            path: trimmedVideoMeta.path,
            size: size,
            duration: duration,
            user: req.user.id,
        });

        await VideoTable.save(trimmedVideo);

        res.status(200).json({
            message: 'Video trimmed successfully',
            video: trimmedVideo,
        });
    } catch (error) {
        next(error);
    }
};


const mergeVideo = async (req, res, next) => {
    try {
        const { videos } = req.body;

        const videoRecords = await VideoTable.find({
            where: {
                id: In(videos),
                user: req.user.id
            },
        });
        if (videoRecords.length !== videos.length) {
            return res.status(400).json({ error: 'Videos not found' });
        }

        const videoPaths = videoRecords.map((video) => video.path);
        const mergedVideoMeta = await mergeVideos(videoPaths);


        const { duration, size } = await getFileMetaData(mergedVideoMeta.path);

        const mergedVideo = VideoTable.create({
            name: mergedVideoMeta.file_name,
            path: mergedVideoMeta.path,
            size: size,
            duration: duration,
            user: req.user.id,
        });

        await VideoTable.save(mergedVideo);

        res.status(200).json({
            message: 'Videos merged successfully.',
            video: mergedVideo,
        });
    } catch (error) {
        next(error);
    }
};


const getSharedVideo = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const disposition = req.headers['content-disposition'] || 'inline';

        const publicLinkRecord = await PublicLinksTable.findOneBy({ slug });

        if (!publicLinkRecord) {
            return res.status(400).json({ error: 'Video not found' });
        }
        if (publicLinkRecord.expire_at < new Date()) {
            await appDataSource.createQueryBuilder()
                .delete()
                .from(PublicLinks)
                .where("slug = :slug", { slug })
                .execute()

            return res.status(404).json({ error: 'Video not found' });
        }
        const videoRecord = await VideoTable.findOneBy({ id: publicLinkRecord.video });


        sendVideo(videoRecord.path, req, res, disposition);

    } catch (error) {
        next(error);
    }
}

module.exports = { uploadVideo, trimVideo, mergeVideo, getSharedVideo };