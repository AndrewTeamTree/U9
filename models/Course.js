'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('./index'); 
const User = require('./user'); 

const Course = sequelize.define('Course', { 
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
});

// Define association with User model
Course.associate = (models) => {
  Course.belongsTo(models.User, {
    foreignKey: {
      fieldName: 'userId',
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
};

module.exports = Course;
