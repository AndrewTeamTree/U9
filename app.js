
'use strict';

const express = require('express');
const morgan = require('morgan');
 const authUser = require('./middleware/authUser'); 
const userRoute = require('./routes/userRoutes');
const courseRoute = require('./routes/courseRoutes');
const app = express();
// Import Sequelize and your Sequelize model
const sequelize = require('./models/index').sequelize;

// Attempt to authenticate with the database
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Apply authentication middleware to routes
app.post('/api/resource', authUser, (req, res) => { 
  res.json({ message: 'Accessed successfully' });
});

app.use(express.json());
app.use(morgan('dev'));

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

// Check if headers have already been sent
  if (res.headersSent) {
    return next(err);
}
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
