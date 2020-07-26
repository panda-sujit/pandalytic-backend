const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('config');
const express = require('express');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordValid) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();

  res.status(200).send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
