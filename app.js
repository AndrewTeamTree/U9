'use strict';

// Load modules
const express = require('express');
const morgan = require('morgan');
const User = require('./models/user'); 
const Course = require('./models/course'); 
const sequelize = require('./sequelize'); 

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

    // Authentication successful, start the server
    startServer();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Function to start the server
function startServer() {
  
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the REST API project!',
    });
  });

// Define a route to get all users
app.get('/api/users', async (req, res, next) => {
  try {
    
    const users = await User.findAll();
    
    res.status(200).json(users);
  } catch (error) {
    
    next(error);
  }
});

// Define a route to create a new user
app.post('/api/users', async (req, res, next) => {
  try {
    
    const newUser = await User.create(req.body);
    
    res.status(201).json(newUser);
  } catch (error) {
    
    next(error);
  }
});


// Define a route to get all courses
app.get('/api/courses', async (req, res, next) => {
  try {
   
    const courses = await Course.findAll();
    
    res.status(200).json(courses);
  } catch (error) {
    
    next(error);
  }
});

// Define a route to create a new course
app.post('/api/courses', async (req, res, next) => {
  try {
    
    const newCourse = await Course.create(req.body);
    
    const courseId = newCourse.id;
    
    res.location(`/api/courses/${courseId}`);
    
    res.status(201).json(newCourse);
  } catch (error) {
    
    next(error);
  }
});

// Define a route to get a specific course by ID
app.get('/api/courses/:id', async (req, res, next) => {
  try {
    
    const course = await Course.findOne({
      where: { id: req.params.id },
      include: [{ model: User }],
    });

    if (course) {
      
      res.status(200).json(course);
    } else {
      
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    
    next(error);
  }
});

// Define a route to update a specific course by ID
app.put('/api/courses/:id', async (req, res, next) => {
  try {
    
    const course = await Course.findByPk(req.params.id);

    if (course) {
      
      await course.update(req.body);
      
      res.status(204).end();
    } else {
      
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    
    next(error);
  }
});

// Define a route to delete a specific course by ID
app.delete('/api/courses/:id', async (req, res, next) => {
  try {
    
    const course = await Course.findByPk(req.params.id);

    if (course) {
      
      await course.destroy();
      
      res.status(204).end();
    } else {
      
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    
    next(error);
  }
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
}

module.exports = app; 
