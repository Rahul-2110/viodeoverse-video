const app = require("../src");
const { config } = require("../src/config");
const { initDb } = require("../src/db");


const getServerInstance = async () => {
    try {
        app.listen(config.get('port'), () => {
            console.log(`Server running on http://localhost:${config.get('port')}`);
        });
    }
    catch (err) {
        console.log(er)
    }
    return app;
}

module.exports = {
    getServerInstance
}
