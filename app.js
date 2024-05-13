'use strict';

const express = require('express');
const morgan = require('morgan');
const sequelize = require('./models/index').sequelize; 
const userRoute = require('./routes/userRoutes');
const courseRoute = require('./routes/courseRoutes');
const authMiddleware = require('./middleware/asyncHandler');
const app = express();

// Apply authentication middleware to routes
app.post('/api/resource', authMiddleware.authenticateJWT, (req, res) => {
  // This route is protected, only accessible with a valid JWT token
  res.json({ message: 'Protected resource accessed successfully' });
});

app.use(express.json());
app.use(morgan('dev'));
app.use('/api', userRoute);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Define route middleware
app.use('/api', userRoute);
app.use('/api', courseRoute);

// Route not found middleware
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Start the server
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    const port = process.env.PORT || 5000;
     app.listen(port, () => {
      console.log(`Express server is listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
