const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authRoutes, videoRoutes, shareRoutes } = require('./routes');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use(authRoutes)
app.use(videoRoutes)
app.use(shareRoutes)


module.exports = app;