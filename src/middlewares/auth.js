const { UserTable } = require("../db/tables");


const authMiddleware = async (req, res, next) => {
    let bearer = req.headers['authorization'];
    let token = bearer.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const user = await UserTable.findOne({ where: { token } });
    if (!user) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
};

module.exports = authMiddleware;
