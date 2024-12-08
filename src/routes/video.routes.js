const { Router } = require('express');
const { uploadVideo, trimVideo, mergeVideo, getSharedVideo } = require('../controllers/video.controller');
const { uploadValidator } = require('../utils/video');
const authMiddleware = require('../middlewares/auth');
const { validateRequest } = require('../utils/validators/request.validator');
const { trimVideoSchema, mergegeVideoSchema } = require('../utils/validators/video.validator');

const router = Router();

router.post('/upload', [authMiddleware, uploadValidator], uploadVideo);
router.post('/trim/:id', [authMiddleware, validateRequest(trimVideoSchema)], trimVideo);
router.post('/merge', [authMiddleware, validateRequest(mergegeVideoSchema)], mergeVideo);
router.get('/:slug', getSharedVideo);

module.exports = router;
