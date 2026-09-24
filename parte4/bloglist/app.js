const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

logger.info('connecting to ', config.MONGO_URL);

mongoose.connect(config.MONGO_URL).then(() => {
    logger.info('connected to MongoDB');
}).catch((error) => {
    logger.error('error connecting:',error.message);
})

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

app.use(middleware.errorHandler);

module.exports = app;