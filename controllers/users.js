const User = require('../models/user.js');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: 'Error getting users', error: err.message}));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({message: 'User not found'});
      }
      res.send(user);
    })
    .catch(err => res.status(500).send({ message: 'Error getting user', error: err.message}));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar){
    return res.status(400).send({ message: 'Bad Request' });
  }
  User.create({ name, avatar })
    .then(user => res.status(201).send({
      _id: user._id,
      name:user.name,
      avatar: user.avatar
    }))
    .catch(err => {
      if (err.na,e === 'ValidationError') {
        return res.status(400).send({ message: 'Bad Request'});
      }
      return res.status(500).send({ message: 'Internal Server Error'});
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser
};