const cors = require('cors');
const express = require('express');

const auth = require('../routes/auth');
const users = require('../routes/users');
const home = require('../modules/home/routes/home.route');
const blogs = require('../modules/blogs/routes/blog.route');
const teams = require('../modules/teams/routes/teams.route');
const quotes = require('../modules/quotes/routes/quotes.route');
const careers = require('../modules/careers/routes/careers.route');
const newsfeed = require('../modules/newsfeed/routes/newsfeed.route');
const pricings = require('../modules/pricings/routes/pricings.route');
const projects = require('../modules/projects/routes/projects.route');
const contactus = require('../modules/contactus/routes/contactus.route');
const testimonials = require('../modules/testimonials/routes/testimonials.route');
const content = require('../modules/content/routes/content.route');

const error = require('../middleware/error');

module.exports = function (app) {
  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));

  app.use('/', home);
  app.use('/api/auth', auth);
  app.use('/api/blogs', blogs)
  app.use('/api/users', users);
  app.use('/api/teams', teams);
  app.use('/api/quotes', quotes);
  app.use('/api/careers', careers);
  app.use('/api/projects', projects);
  app.use('/api/pricings', pricings);
  app.use('/api/newsfeed', newsfeed);
  app.use('/api/contactus', contactus);
  app.use('/api/testimonial', testimonials);
  app.use('/api/content', content);

  app.use(error)
}
