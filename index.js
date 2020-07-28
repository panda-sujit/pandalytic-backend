const config = require('config');
const express = require('express');
const cloudinary = require('cloudinary');
// const morgan = require('morgan');

const app = express();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);

// Morgan
// if (app.get('env') === 'development') {
//   app.use(morgan('tiny'));
//   console.log('Morgan Enabled');
// }

// Dynamic PORT
const port = process.env.PORT || config.get('port');
const server = app.listen(port, () => console.log(`Server Listening to port ${port}.`));

module.exports = server;
