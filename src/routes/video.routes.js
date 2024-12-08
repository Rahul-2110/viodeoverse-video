const { Router } = require('express');
const { uploadVideo, trimVideo, mergeVideo } = require('../controllers/video.controller');
const { uploadValidator } = require('../utils/video');
const authMiddleware = require('../middlewares/auth');
const { validateRequest } = require('../utils/validators/request.validator');
const { trimVideoSchema, mergegeVideoSchema } = require('../utils/validators/video.validator');

const router = Router();

router.use(authMiddleware);

router.post('/upload', uploadValidator, uploadVideo);
router.post('/trim/:id', validateRequest(trimVideoSchema), trimVideo);
router.post('/merge', validateRequest(mergegeVideoSchema), mergeVideo);


module.exports = router;
