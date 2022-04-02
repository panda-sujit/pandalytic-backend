const config = require('config');
const express = require('express');
// const morgan = require('morgan');

const app = express();

// Add headers
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "DELETE, GET, POST, PUT, PATCH");
//   // Pass to next layer of middleware
//   next();
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

// production db linkk
// mongodb+srv://pandalytic-admin:T3chn0l0gy@pandalytic-cluster.waaq6.mongodb.net/db_pandalytic?retryWrites=true&w=majority