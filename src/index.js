const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { authRoutes } = require('./routes');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());


// Routes
app.use(authRoutes)


module.exports = app;