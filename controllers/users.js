const User = require('../models/user');
const { CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error getting users', error: err.message}));
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(NOT_FOUND).send({message: 'User not found'});
      }
      return res.send(user);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({
          message: 'Invalid user ID'
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error getting user'});
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar){
    return res.status(BAD_REQUEST).send({ message: 'Bad Request' });
  }
  return User.create({ name, avatar })
    .then(user => res.status(CREATED).send({
      _id: user._id,
      name:user.name,
      avatar: user.avatar
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request'});
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal Server Error'});
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser
};