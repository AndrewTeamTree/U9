'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config');

// Define the path to your SQLite database file
const dbPath = path.join(__dirname, '..', 'fsjstd-restapi.db');

// Create a new Sequelize instance with the SQLite dialect and database path
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath, // Use the dbPath for SQLite storage
});

const db = {};

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const filePath = path.join(__dirname, file);
    const modelDefiner = require(filePath);
    const modelName = path.basename(file, '.js');
    const model = modelDefiner(sequelize);
    db[modelName] = model;
  });

// Associate all models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
    } catch (error) {
      console.error(`Error associating ${modelName} model:`, error);
    }
  }
});


module.exports = {
  sequelize, // Export the Sequelize instance
  models: db, // Export models
};
