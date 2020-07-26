const logger = require('./logger');

module.exports = function (err, req, res, next) {
  // Log the exception
  logger.error(err.message, err);

  res.status(500).send('INTERNAL SERVER ERROR');
}
