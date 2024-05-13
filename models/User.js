'use strict';
const { Model, DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model { }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a valid input only containing letters and hyphens.',
        },
        notEmpty: {
          msg: 'A first name is required.'
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a valid input only containing letters and hyphens.',
        },
        notEmpty: {
          msg: 'A last name is required.'
        },
      },
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email adress must be unique. This email is already registered.',
      },
      validate: {
        notNull: {
          msg: 'Please enter a valid email address',
        },
        notEmpty: {
          msg: 'Please provide an email address.',
        },
        isEmail: {
          msg: 'Invalid email format. Please enter a valid email address',
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A password is required.',
        },
        notEmpty: {
          msg: 'Please provide a password.',
        },
      },
      set(val) {
        const hashedPassword = bcryptjs.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      }
    },
  }, { sequelize });

  User.associate = (models) => {
    User.hasMany(models.Course);
  };

  return User;
};
