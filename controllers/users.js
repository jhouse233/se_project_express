const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED, OK, CONFLICT_ERROR } = require('../utils/constants');
const { JWT_SECRET } = require('../utils/config');

const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .then(user => {
      if (!user) {
        throw new NotFoundError('User not found')
      }
      return res.json(user);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Invalid user ID'))
      }
      next(err);
    })
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email and password are required'))
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
        return next(new ConflictError('Email already exists'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message))
      }
      next(err);
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
      throw new NotFoundError('User not found')
    }
    res.json(user);
  })
  .catch(err => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Invalid user ID'));
    }
    if (err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).json({ message: err.message})
    }
    return next(new BadRequestError(err.message));
  })
};

const login = (req, res) => {
  const {email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError('Email and password are required'));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(OK).json({ message: 'Success', token });
    })
    .catch(err => {
      if (err.message === 'Incorrect email or password') {
        return next(new UnauthorizedError(err.message));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUser,
};