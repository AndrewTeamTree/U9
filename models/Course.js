'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../models').sequelize; // Import sequelize instance from models/index.js

module.exports = (sequelize, modelName, options = {}) => {
  class Course extends Model {}

  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      estimatedTime: {
        type: DataTypes.STRING
      },
      materialsNeeded: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName,
      ...options // Pass additional options here
    }
  );

  return Course;
};
