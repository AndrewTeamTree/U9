'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../models').sequelize; // Import sequelize instance from models/index.js

class User extends Model {}

User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please provide a first name' 
      },
      notEmpty: {
        msg: 'First name cannot be empty' 
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please provide a last name' 
      },
      notEmpty: {
        msg: 'Last name cannot be empty' 
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notNull: {
        msg: 'Please provide an email address' 
      },
      isEmail: {
        msg: 'Please provide a valid email address' 
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Please provide a password' 
      },
      notEmpty: {
        msg: 'Password cannot be empty' 
      }
    }
  }
}, {
  sequelize, // Pass the sequelize instance
  modelName: 'User'
});

module.exports = User;
