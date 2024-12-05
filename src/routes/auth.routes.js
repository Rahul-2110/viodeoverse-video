const { Router } = require('express');
const { validateRequest } = require('../utils/validators/request.validator');
const { registerSchema } = require('../utils/validators/auth.validator');

const { registerUser } = require('../controllers/auth.controller');

const router = Router();

router.post('/register', validateRequest(registerSchema), registerUser);

module.exports = router;
