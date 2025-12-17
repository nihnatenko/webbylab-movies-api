const sequelize = require('../config/db');
const User = require('./userModel');
const Movie = require('./movieModel');
const Actor = require('./actorModel');

Movie.belongsToMany(Actor, {
  through: {
    model: 'MovieActors',
    unique: false,
  },
  as: 'actors',
  onDelete: 'CASCADE',
});

Actor.belongsToMany(Movie, {
  through: {
    model: 'MovieActors',
    unique: false,
  },
  as: 'movies',
});

const initDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Movie,
  Actor,
  initDB,
};
