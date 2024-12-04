
const { config } = require('./src/config.js');
const { initDb } = require('./src/db/index.js');
const app = require('./src/index.js');


(async () => {
    try {
        await initDb();
        app.listen(config.get('port'), () => {
            console.log(`Server running on http://localhost:${config.get('port')}`);
        });
    }
    catch (err) {
        console.log(er)
    }
})()
