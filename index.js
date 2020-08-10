// const cors = require('cors');
const config = require('config');
const express = require('express');
// const morgan = require('morgan');

const app = express();
const corsOption = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // to works well with web app, OPTIONS is required
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}
app.use(cors(corsOption));
app.options('*', cors(corsOption));

// app.use(function (req, res, next) {
// res.header("Access-Control-Allow-Origin", "*");
// res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
// next();

// res.header("Access-Control-Allow-Origin", "*") //* to give access to any origin
// res.header(
//   "Access-Control-Allow-Headers",
//   "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-auth-token" //to give access to all the headers provided
// );
// if (req.method === 'OPTIONS') {
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //to give access to all the methods provided
//   return res.status(200).json({});
// }
// next();
// });

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
