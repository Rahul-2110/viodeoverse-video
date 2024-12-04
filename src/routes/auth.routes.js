const { Router } = require('express');
const { validateRequest } = require('../utils/validators/request.validator');
const { registerSchema } = require('../utils/validators/auth.validator');
const { UserTable } = require('../db/tables');
const { User } = require('../db/models/user');


const router = Router();

router.post('/register', validateRequest(registerSchema), async (req, res) => {
    try {
        const { username } = req.body;
        const userExists = await UserTable.findOne({ where: { username } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User(username);
        const userDoc = await UserTable.save(user);
        res.status(201).json({ ...userDoc });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
