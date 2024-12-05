const multer = require("multer");
const { uploadValidator } = require("../utils/video");


const uploadVideo = async (req, res) => {
    uploadValidator(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        }
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            res.status(200).json({
                message: 'Video uploaded successfully'
            });
            res.status(201).json({ message: 'Video uploaded successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    });
}

module.exports = { uploadVideo };