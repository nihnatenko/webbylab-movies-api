const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MovieModel = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1850, max: new Date().getFullYear() },
  },
  format: {
    type: DataTypes.ENUM('VHS', 'DVD', 'Blu-Ray'),
    allowNull: false,
  },
});

module.exports = MovieModel;
