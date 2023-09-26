const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
require('dotenv').config();

const routers = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/bitfilmsdb')
  .then(() => console.log('MongoDB Connected'));

// Routes
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api', routers);

// Error handlers
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// Start server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
