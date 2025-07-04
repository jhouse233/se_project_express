const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()
const { PORT = 3001 } = process.env;
const app = express();

const userRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingitems');

const { login, createUser } = require('./controllers/users');

const { NOT_FOUND } = require('./utils/constants')

const errorHandler = require('./middlewares/error-handler');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.post('/signup', createUser);
app.post('/signin', login);
app.use('/items', clothingItemsRouter);
app.use('/users', userRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found'})
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
