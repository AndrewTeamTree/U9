'use strict';

const express = require('express');
const router = express.Router();
const authUser = require('../middleware/authUser');
const { User, Course } = require('../models'); 
const { check, validationResult } = require('express-validator');



router.post('/courses', authUser, [
  check('title').notEmpty().withMessage('Title is required'),
  check('description').notEmpty().withMessage('Description is required'),
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// GET /api/courses route
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: {
        model: User,
      }
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// GET /api/courses/:id route
// Define the route handler as a separate function
const getCourseByIdHandler = async (req, res) => {
    const courseId = req.params.id;
    console.log('Requested Course ID:', courseId);
    try {
        const course = await Course.findByPk(courseId, {
            include: {
                model: User,
            }
        });
        if (course) {
            console.log('Found Course:', course);
            res.json(course);
        } else {
            console.log('Course not found');
            res.status(404).json({ error: 'Course not found' });
        }
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Use the route handler with the authUser middleware
router.get('/courses/:id', getCourseByIdHandler);



// PUT /api/courses/:id route
router.put('/courses/:id', authUser, [
  check('title')
    .notEmpty()
    .withMessage('Please enter a valid course title.'),
  check('description')
    .notEmpty()
    .withMessage('Please enter a valid course description.'),
],
async (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    let course;
    try {
      course = await Course.findByPk(req.params.id);
      if (course) {
        await course.set(req.body);
        const user = await User.findByPk(req.body.userId);

        // check if user exists before Course can be saved
        if (!user) {
          res.status(404).json({ message: 'User not found' });
        }

        await course.save();
        res.status(204).location(`/courses/${course.id}`).end();
      } else {
        res.status(404).json({ message: 'Course not found.' });
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error; //error caught in the asyncHandler's catch block
      }
    }
  } else {
    res.status(400).send({ errors: result.array() }); // runs if empty title or description
  }
});


// DELETE /api/courses/:id route
router.delete('/courses/:id', authUser, async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    await course.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Course not found' });
  };
});

module.exports = router;




