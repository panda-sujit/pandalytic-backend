const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    const decode = jwt.verify(token, config.get('jwtPrivateKey'));
    (req.user = decode);
    next();
  } catch (ex) {
     res.status(400).send('Invalid Token.')
  }
}
