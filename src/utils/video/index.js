
const { config } = require("../../config");
const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');
const ffmpeg = require("fluent-ffmpeg");

const UPLOAD_DIR = path.join(
    __dirname,
    config.get("video.upload_dir")
);

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`),
});

const uploadValidator = multer({
    storage: storage,
    limits: { fileSize: config.get("video.max_size_mb") * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileExt = path.extname(file.originalname).toLowerCase();
        if (fileExt !== '.mp4' && fileExt !== '.mov') {
            return cb(
                new APIError(
                    400,
                    'Invalid file type. Only MP4 and MOV are allowed'
                )
            );
        }
        cb(null, true);
    },
}).single('video');


function validateVideoDuration(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                fs.unlinkSync(filePath);
                console.log(err);
                resolve({ error: "Error analyzing video", duration: null });
            }

            if (!metadata || !metadata.format) {
                fs.unlinkSync(filePath);
                resolve({ error: "Metadata is undefined or invalid", duration: null}); 
            }

            const duration = metadata.format.duration;
            if (duration < config.get("video.min_duration_sec") || duration > config.get("video.max_duration_sec")) {
                fs.unlinkSync(filePath);
                reject({error: `Video duration must be between ${config.get("video.min_duration_sec")} and ${config.get("video.max_duration_sec")} seconds`, duration: null}); 
            }
            resolve({ duration, error: null });
        });
    });
}


function cutVideo(filePath, start, end) {
    return new Promise((resolve, reject) => {
        const fileName = path.basename(filePath, path.extname(filePath));
        const trimmedFileName = `trimmed_${Math.floor(10000 + Math.random() * 90000)}_${fileName}.mp4`
        const trimmedPath = path.join(
            path.dirname(filePath),
            trimmedFileName
        );

        const command = ffmpeg(filePath).setStartTime(start);

        if (end) {
            command.setDuration(end - start);
        }

        command
            .output(trimmedPath)
            .on('end', () => {
                resolve({ path: trimmedPath, file_name: trimmedFileName });
            })
            .on('error', (error) => {
                reject(error);
            })
            .run();
    });
}


function mergeVideos(filePaths) {
    const mergedFileName =  `merged_${Date.now()}.mp4`
    return new Promise((resolve, reject) => {
        const mergeListPath = path.join(
            path.dirname(filePaths[0]),
            'merge_list.txt'
        );
        const mergedVideoPath = path.join(
            path.dirname(filePaths[0]),
            mergedFileName
        );

        fs.writeFileSync(
            mergeListPath,
            filePaths.map((filePath) => `file '${filePath}'`).join('\n')
        );

        ffmpeg()
            .input(mergeListPath)
            .inputOptions(['-f concat', '-safe 0'])
            .outputOptions(['-c copy'])
            .output(mergedVideoPath)
            .on('end', () => {
                fs.unlinkSync(mergeListPath);
                resolve({path: mergedVideoPath, file_name: mergedFileName});
            })
            .on('error', (error) => {
                if (fs.existsSync(mergeListPath)) {
                    fs.unlinkSync(mergeListPath);
                }
                reject(error);
            })
            .run();
    });
}


function getFileMetaData(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                return reject(err);
            }

            const data = metadata.format;
            resolve(data);
        });
    });
}



module.exports = { uploadValidator, validateVideoDuration, cutVideo, mergeVideos, getFileMetaData};