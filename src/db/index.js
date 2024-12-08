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
        console.log('Connecting to database...');
        await appDataSource.initialize();
        console.log('Database connected!!');
    } catch (error) {
        console.error('Database connection error: ', error);
    }
}

module.exports = {
    initDb,
    appDataSource
};
