
const { config } = require('./src/config.js');
const app = require('./src/index.js');

app.listen(config.get('port'), () => {
    console.log(`Server running on http://localhost:${config.get('port')}`);
});