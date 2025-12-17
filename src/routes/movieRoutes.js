const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, movieController.list);
router.get('/:id', authMiddleware, movieController.show);
router.post('/', authMiddleware, movieController.create);
router.delete('/:id', authMiddleware, movieController.delete);

module.exports = router;
