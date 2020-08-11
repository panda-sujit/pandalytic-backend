const cors = require('cors');
const config = require('config');
const express = require('express');
// const morgan = require('morgan');

const app = express();
// const corsOption = {
//   'allowedHeaders': ['Authorization', 'Content-Type'],
//   'origin': '*',
//   'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   'preflightContinue': false
// }
// app.use(cors(corsOption));
// app.options('*', cors(corsOption));

// app.use(cors());
// app.use(cors({origin: '*'}));

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type,x-auth-token,Authorization,Content-Type,application/json");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

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
