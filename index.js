// const cors = require('cors');
const config = require('config');
const express = require('express');
// const morgan = require('morgan');

const app = express();
// const corsOption = {
//   origin: true,
//   credentials: true,
//   methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // to works well with web app, OPTIONS is required
//   allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
// }
// app.use(cors(corsOption));
// app.options('*', cors(corsOption));


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

// Heroku link
// https://mighty-citadel-35112.herokuapp.com/

// Mlab link
// "mongodb://pandalytic:T3chn0l0gy@ds121636.mlab.com:21636/db_pandalytic_cms",

// Local db link
// mongodb://localhost/db_cms
