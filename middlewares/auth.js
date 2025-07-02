const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require('../errors/UnauthorizedError');

const authorize = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new UnauthorizedError('Authorization required'));
  }
  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Authorization token expired or invalid'))
    }
    if  (err.name === 'JsonWebTokenError'){
      return next(new UnauthorizedError('Invalid authorization token format'))
    }
    return next(new UnauthorizedError('Invalid token'))
  }
}


module.exports = {
  authorize,
}
