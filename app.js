'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');
const sequelize = require('./sequelize'); // Import your Sequelize instance
const User = require('./user'); // Import User model
const Course = require('./course'); // Import Course model

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Create the Express app
const app = express();

// Setup morgan which gives us http request logging
app.use(morgan('dev'));

// Initialize Sequelize
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Sync models with the database
    await sequelize.sync({ alter: true });
    console.log('Models have been synchronized with the database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set our port
app.set('port', process.env.PORT || 5000);

// Start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
