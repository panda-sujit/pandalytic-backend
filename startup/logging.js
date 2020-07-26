const logger = require('../middleware/logger');

module.exports = function () {
  process.on('uncaughtException', (exception) => {
    logger.error(exception.message, exception);
    process.exit(1);
  });

  process.on('unhandledRejection', (exception) => {
    logger.error(exception.message, exception);
    process.exit(1);
  });
}
