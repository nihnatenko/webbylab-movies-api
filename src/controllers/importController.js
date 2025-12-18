const { Movie, Actor, sequelize } = require('../models');
const parseMoviesFile = require('../utils/movieParser');
const fs = require('fs').promises;

exports.importMovies = async (req, res) => {
  if (!req.file) return res.status(400).json({ status: 0, error: 'FILE_REQEIRED' });

  const transaction = await sequelize.transaction();
  const actorsCache = new Map();

  try {
    const parsedMovies = await parseMoviesFile(req.file.path);
    let importsCount = 0;

    for (const movieData of parsedMovies) {
      let movie = await Movie.findOne({
        where: { title: movieData.title, releaseYear: movieData.releaseYear },
        transaction,
      });

      if (!movie) {
        movie = await Movie.create(
          {
            title: movieData.title,
            releaseYear: movieData.releaseYear,
            format: movieData.format,
          },
          { transaction }
        );
      }

      const uniqueActors = [...new Set(movieData.stars.map((s) => s.trim()))];

      if (uniqueActors.length > 0) {
        const actorInstances = [];
        for (const actorName of uniqueActors) {
          let actor;
          if (actorsCache.has(actorName)) {
            actor = actorsCache.get(actorName);
          } else {
            [actor] = await Actor.findOrCreate({
              where: { name: actorName },
              transaction: transaction,
            });
            actorsCache.set(actorName, actor);
          }
          actorInstances.push(actor);
        }

        await movie.setActors(actorInstances, { transaction });
      }
      importsCount++;
    }

    await transaction.commit();
    res.json({ status: 1, data: { imported: importsCount } });
  } catch (error) {
    await transaction.rollback();
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    console.error('Import Error Details:', error);
    res.status(400).json({ status: 0, error: error.message });
  } finally {
    try {
      await fs.unlink(req.file.path);
    } catch (cleanupError) {
      if (cleanupError.code !== 'ENOENT') {
        console.warn('Could not delete temp file', cleanupError.message);
      }
    }
  }
};
