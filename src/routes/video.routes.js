const { Router } = require('express');
const { validateRequest } = require('../utils/validators/request.validator');
const { uploadVideo } = require('../controllers/video.controller');

const router = Router();

router.post('/upload', uploadVideo);


module.exports = router;
