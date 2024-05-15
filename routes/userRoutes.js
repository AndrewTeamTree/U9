
const asyncHandler = require('../middleware/asyncHandler');
const authUser = require('../middleware/authUser');
const { check, validationResult } = require('express-validator');
const  User  = require('../models'); 
const bcrypt = require('bcryptjs'); 
const express = require('express');
const router = express.Router();
const nameRegex = /^[a-zA-Z-]+(?:[\s-][a-zA-Z-]+)*$/;
const base64Credentials = Buffer.from('username:password').toString('base64');


// Middleware to add Authorization header to requests
const addAuthorizationHeader = (req, res, next) => {
  req.headers.authorization = `Basic ${base64Credentials}`;
  next();
};

// Apply the middleware to all routes in this router
router.use(addAuthorizationHeader);



// GET /api/users route
router.get('/users', authUser, asyncHandler(async (req, res) => {
  try {
    const { emailAddress } = req.query;

    if (emailAddress) {
      const user = await User.findOne({ where: { emailAddress } });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}));

/* CREATE a new user */
router.post('/users', [
  check('firstName').isLength({ min: 2 }).matches(nameRegex).withMessage('First name is required. Please use only alphabetic characters and hyphens.'),
  check('lastName').isLength({ min: 2 }).matches(nameRegex).withMessage('Last name is required. Please use only alphabetic characters and hyphens.'),
  check('emailAddress').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 8, max: 20 }).withMessage('Must be 8-20 characters in length.')
], asyncHandler(async (req, res) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
      await User.create(req.body);
      res.status(201).location('/').end();
    } catch (error) {
      if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  } else {
    res.status(400).json({ errors: result.array() });
  }
}));

module.exports = router;
