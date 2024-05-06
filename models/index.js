'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

// Define the path to your SQLite database file
const dbPath = path.join(__dirname, '..', 'fsjstd-restapi.db');

// Create a new Sequelize instance with the SQLite dialect and database path
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
});

const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const modelDefiner = require(path.join(__dirname, file));
    const modelName = path.basename(file, '.js'); 
    const model = modelDefiner(sequelize); 
    db[modelName] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = {
  sequelize,
  ...db
};
