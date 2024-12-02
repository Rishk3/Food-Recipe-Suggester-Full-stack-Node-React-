const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const dishesRoutes = require('./routes/dishes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/dishes', dishesRoutes);

module.exports = app;
