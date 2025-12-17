const { Movie, Actor, sequelize } = require('../models');
const { seq } = require('sequelize');

exports.create = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { title, releaseYear, format, stars } = req.body;

    const movie = await Movie.create({ title, releaseYear, format }, { transaction });

    if (stars && stars.length > 0) {
      for (const name of stars) {
        const [actor] = await Actor.findOrCreate({
          where: { name: name.trim() },
          transaction: transaction,
        });
        await movie.addActor(actor, { transaction });
      }
    }

    await transaction.commit();
    const result = await Movie.findByPk(movie.id, { include: ['actors'] });
    res.status(201).json({ status: 1, data: result });
  } catch (error) {
    console.error('Create Movie Error Details:', error);
    await transaction.rollback();
    res.status(400).json({ status: 0, error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ status: 0, error: 'MOVIR_NOT_FOUND' });

    await movie.destroy();
    res.json({ status: 1 });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};

exports.show = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, { include: ['actors'] });
    if (!movie) return res.status(404).json({ status: 0, error: 'MOVIR_NOT_FOUND' });
    res.json({ status: 1, data: movie });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { title, actor, sort, order = 'ASC' } = req.query;
    let whereClause = {};
    let actorWhereClause = {};

    if (title) {
      whereClause.title = { [seq.like]: `%${title}%` };
    }
    if (actor) {
      actorWhereClause.name = { [seq.like]: `%${actor}%` };
    }

    const movies = await Movie.findAll({
      where: whereClause,
      include: [
        {
          model: Actor,
          as: 'actors',
          where: Object.keys(actorWhereClause).length ? actorWhereClause : null,
          required: !!actor,
        },
      ],
      order: sort === 'title' ? [['title', order]] : [['id', 'ASC']],
    });

    res.json({ status: 1, data: movies });
  } catch (error) {
    res.status(500).json({ status: 0, error: error.message });
  }
};
