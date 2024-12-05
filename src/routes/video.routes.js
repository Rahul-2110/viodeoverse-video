const { Router } = require('express');
const { uploadVideo } = require('../controllers/video.controller');
const { uploadValidator, validateVideoDuration } = require('../utils/video');

const router = Router();

router.post('/upload', [uploadValidator], uploadVideo);


module.exports = router;
