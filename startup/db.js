const config = require('config');
const mongoose = require('mongoose');

module.exports = function () {
  const db = config.get('db');
  mongoose.connect(db)
    .then(() => console.log(`Connection established to ${db} database successfully`))
    .catch(err => console.log(`Connection established to ${db} database failed.`, err.message));
}
