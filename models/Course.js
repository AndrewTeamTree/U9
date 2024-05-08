'use strict';

const { DataTypes, Sequelize } = require('sequelize');
const config = require('../config/config.json');

// Create Sequelize instance using the configuration options
const sequelize = new Sequelize(config.development);

const course = sequelize.define('course', { 
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
course.associate = (models) => {
  course.belongsTo(models.User, {
    foreignKey: {
      fieldName: 'userId',
      allowNull: false,
    },
    onDelete: 'CASCADE',
  });
};

module.exports = course;
