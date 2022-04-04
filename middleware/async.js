module.exports = function (handler) {
  return async (req, res, next) => {
    try {
     return await handler(req, res);
    } catch (execptionError) {
      next(execptionError)
    }
  }
}
