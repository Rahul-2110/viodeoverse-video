const { User } = require("../db/models");

const registerUser = async (req, res) => {
    try{
        const { username } = req.body;
        const user = await User.create({ username });
        res.status(201).json({ user });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registerUser };