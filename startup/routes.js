const cors = require('cors');
const express = require('express');

const auth = require('../routes/auth');
const home = require('../routes/home');
const teams = require('../routes/teams');
const users = require('../routes/users');
const genres = require('../routes/genres');
const movies = require('../routes/movies');
const careers = require('../routes/career');
const rentals = require('../routes/rentals');
const returns = require('../routes/returns');
const projects = require('../routes/project');
const customers = require('../routes/customers');
const contactus = require('../routes/contactus');
const testimonials = require('../routes/testimonial');

const error = require('../middleware/error');

module.exports = function (app) {
  // app.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", '*');
  //   res.header("Access-Control-Allow-Credentials", true);
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  //   res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
  //   next();
  // });

  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));

  app.use('/', home);
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/teams', teams);
  app.use('/api/genres', genres);
  app.use('/api/movies', movies);
  app.use('/api/careers', careers);
  app.use('/api/rentals', rentals);
  app.use('/api/returns', returns);
  app.use('/api/projects', projects);
  app.use('/api/customers', customers);
  app.use('/api/contactus', contactus);
  app.use('/api/testimonial', testimonials);

  app.use(error)
}
