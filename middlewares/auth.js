
const authorize = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Authorization required'})
  }
  next();
}

module.exports = {
  authorize,
}
