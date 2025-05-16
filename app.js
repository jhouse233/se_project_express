const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { PORT = 3001 } = process.env;
const app = express();

const userRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingitems');

const { login, createBasicUser } = require('./controllers/users');

const { NOT_FOUND } = require('./utils/constants')
// const { authorize } = require('./middlewares/auth');


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');
app.use(cors());
app.use(express.json());
// app.use((req, res, next) => {
//   req.user = {
//     _id: "5d8b8592978f8bd833ca8133"
//   };
//   next();
// });
app.post('/signup', createBasicUser);
app.post('/signin', login);

app.use('/items', clothingItemsRouter);
app.use('/users', userRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Requested resource not found'})
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});
