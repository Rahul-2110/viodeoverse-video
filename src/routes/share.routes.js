const { Router } = require('express');
const authMiddleware = require('../middlewares/auth');
const { validateRequest } = require('../utils/validators/request.validator');
const { shareVideo } = require('../controllers/share.controller');
const { shareVideoSchema } = require('../utils/validators/share.validator');

const router = Router();


router.post('/share', [authMiddleware, validateRequest(shareVideoSchema)], shareVideo);

module.exports = router;
