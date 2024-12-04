const { DataSource } = require('typeorm');
const { config } = require('../config');

const appDataSource = new DataSource({
    type: 'sqlite',
    database: config.get('db.path'),
    synchronize: true,
    entities: [__dirname + '/models/*.js'],
});

async function initDb() {
    try {
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
