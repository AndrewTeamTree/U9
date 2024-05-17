'use strict';
const authUser = require('../middleware/authUser');
const { check, validationResult } = require('express-validator');
const { User } = require('../models');

const express = require('express');
const router = express.Router();
const nameRegex = /^[a-zA-Z-]+(?:[\s-][a-zA-Z-]+)*$/;

// GET /api/users route
router.get('/users', authUser, async (req, res) => {
  const user = req.currentUser;
  res.status(200).json({ user });
});

/* CREATE a new user */
router.post('/users', async (req, res) => {
      let user;
      try {
        await User.create(req.body);
        res.status(201).location('/').end();
      } catch (error) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
          user = await User.build(req.body);
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw (error);
        }
      }
    
  });


module.exports = router;