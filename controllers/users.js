const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK, CONFLICT_ERROR } = require('../utils/constants');
const { JWT_SECRET } = require('../utils/config');

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(NOT_FOUND).json({ message: 'User not found'})
      }
      return res.json(user);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).json({ message: 'Invalid user ID'});
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Error getting user'});
    })
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).json({ message: 'Email and password are required' });
  }
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then(user => res.status(CREATED).json({
      message: 'Success',
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email
    }))
    .catch(err => {
      if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).json({ message: 'Email already exists' })
      }
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).json({ message: err.message});
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error'});
    });
};


const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {new: true, runValidators: true})
    .select('-password')
  .then(user => {
    if (!user) {
      return res.status(NOT_FOUND).json({ message: 'User not found'})
    }
    return res.json(user);
  })
  .catch(err => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST).json({ message: 'Invalid user ID'});
    }
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({ message: err.message})
    }
    return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Error getting user'});
  })
};

const login = (req, res) => {
  const {email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST).json({ message: 'Bad Request'})
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user){
        return res.status(UNAUTHORIZED).json({ message: 'Unauthorized' })
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' })
      return res.status(OK).json({ message: 'Success', token })
    })
    .catch(err => {
      if (err.message === 'Incorrect email or password'){
        return res.status(UNAUTHORIZED).json({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error'})

    })
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};