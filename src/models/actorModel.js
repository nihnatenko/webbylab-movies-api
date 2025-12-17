const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ActorModel = sequelize.define(
  'Actor',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ActorModel;
