const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;
const app = express();

const userRouter = require('./routes/users');


mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '68123daa710934366df09dd9'
  };
  next();
});


app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});

