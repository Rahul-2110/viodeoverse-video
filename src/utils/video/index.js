
const { config } = require("../../config");
const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');

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
        const minFileSize = config.get("video.min_size_mb") * 1024 * 1024;
        if (file.size < minFileSize) {
          return cb(new Error(`File is too small. Minimum size is ${minFileSize} MB.`));
        }
        cb(null, true);
    },
}).single('video');


module.exports = { uploadValidator };