require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const { initDB } = require('./models');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const importRoutes = require('./routes/importRoutes');

const app = express();
const port = process.env.APP_PORT || 8000;

app.use(express.json());

app.use('/api/v1', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/movies', importRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ status: 0, error: 'NOT_FOUND' });
});

const start = async () => {
  try {
    await initDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
