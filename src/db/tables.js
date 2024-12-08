const { appDataSource } = require(".");
const { User, Video, PublicLinks } = require("./models");

const UserTable = appDataSource.getRepository(User);
const VideoTable = appDataSource.getRepository(Video);
const PublicLinksTable = appDataSource.getRepository(PublicLinks);

module.exports = {
    UserTable,
    VideoTable,
    PublicLinksTable,
}