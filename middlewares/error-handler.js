module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  console.error(err.stack || err.message);

  res.status(statusCode).send({
    message:
      statusCode === 500
        ? "An unexpected error occurred on the server"
        : message,
  });
};