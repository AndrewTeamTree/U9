const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize'); // Import your Sequelize instance

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

module.exports = Course;
