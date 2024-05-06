'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('./index'); 

const User = sequelize.define('User', {
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
});

// Define association with Course model
User.associate = (models) => {
  User.hasMany(models.Course, {
    foreignKey: 'userId', 
    onDelete: 'CASCADE' 
  });
};

module.exports = User;
