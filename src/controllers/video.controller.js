const multer = require("multer");
const { appDataSource } = require("../db");
const { Video } = require("../db/models");
const { validateVideoDuration } = require("../utils/video");

const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const filePath = req.file.path;
        const size = req.file.size;
        const fileName = req.file.originalname;

        const durationValidation = await validateVideoDuration(filePath);
        if(durationValidation.error) {
            return res.status(400).json({ error: durationValidation.error });
        }

        const duration = durationValidation.duration;

        const videoRepo = appDataSource.getRepository(Video);
        const video = videoRepo.create({ name: fileName, size, duration, path: filePath });
        await videoRepo.save(video);

        res.status(201).json({
            message: 'Video uploaded successfully'
        });

    } catch (error) {
        console.log(error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ message: error.message });
    }

}


module.exports = { uploadVideo };