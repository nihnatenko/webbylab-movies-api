const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_STORAGE || './data/db.sqliteMovies';
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

module.exports = sequelize;
