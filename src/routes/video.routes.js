const { Router } = require('express');
const { uploadVideo } = require('../controllers/video.controller');
const { uploadValidator } = require('../utils/video');
const authMiddleware = require('../middlewares/auth');

const router = Router();

router.post('/upload', [authMiddleware, uploadValidator], uploadVideo);


module.exports = router;
