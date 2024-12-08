const { DataSource } = require('typeorm');
const { config } = require('../config');
const { PublicLinks, Video, User } = require('./models');

const appDataSource = new DataSource({
    type: 'sqlite',
    database: config.get('db.path'),
    synchronize: true,
    entities: [User, Video, PublicLinks],
});

async function initDb() {
    try {
        await appDataSource.initialize();
    } catch (error) {
        console.error('Database connection error: ', error);
    }
}

module.exports = {
    initDb,
    appDataSource
};
