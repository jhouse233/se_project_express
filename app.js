const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;
const app = express();

const userRouter = require('./routes/users');
const clothingItemsRouter = require('./routes/clothingitems');

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(express.json());
app.use('/items', clothingItemsRouter);

app.use((req, res, next) => {
  req.user = {
    _id: '68123daa710934366df09dd9'
  };
  next();
});

app.use('/users', userRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening at port ${PORT}`);
});

