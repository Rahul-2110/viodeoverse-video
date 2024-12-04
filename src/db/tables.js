const { appDataSource } = require(".");
const { User } = require("./models");

const UserTable = appDataSource.getRepository(User);

module.exports = {
    UserTable
}