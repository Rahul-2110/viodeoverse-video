const { DataSource } = require('typeorm');
const { config } = require('../config');
const User = require('./models/user');
const Video  = require('./models/video');

const appDataSource = new DataSource({
    type: 'sqlite',
    database: config.get('db.path'),
    synchronize: true,
    entities: [User, Video],
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
