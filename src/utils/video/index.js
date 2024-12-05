
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

module.exports = { uploadValidator, validateVideoDuration };