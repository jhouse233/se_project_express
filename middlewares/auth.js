const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/constants");


const authorize = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(UNAUTHORIZED).json({ message: 'Authorization required'})
  }
  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(UNAUTHORIZED).json({ message: 'Authorization token expired or invalid'})
    }
    if  (err.name === 'JsonWebTokenError'){
      return res.status(UNAUTHORIZED).json({ message: 'Invalid authorization token format'})
    }
    return res.status(UNAUTHORIZED).json({ message: 'Invalid token'})
  }
}


module.exports = {
  authorize,
}
