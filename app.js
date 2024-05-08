'use strict';

const express = require('express');
const morgan = require('morgan');
const sequelize = require('sequelize');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authMiddleware = require('./middleware/authJwt');
const app = express();

// Apply authentication middleware to routes
app.post('/api/resource', authMiddleware.authenticateJWT, (req, res) => {
  // This route is protected, only accessible with a valid JWT token
  res.json({ message: 'Protected resource accessed successfully' });
});

app.use(express.json());
app.use(morgan('dev'));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Models have been synchronized with the database.');

    app.use('/api/users', userRoutes);
    app.use('/api/courses', courseRoutes);

    app.use((req, res) => {
      res.status(404).json({
        message: 'Route Not Found',
      });
    });

    app.use((err, req, res, next) => {
      console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
      res.status(err.status || 500).json({
        message: err.message,
        error: {},
      });
    });

    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      console.log(`Express server is listening on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
