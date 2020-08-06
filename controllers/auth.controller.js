const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');

const { User } = require('../models/user');


exports.loginUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
  if (!isPasswordValid) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.status(200).send({
    token,
    userObj: {
      name: user.name,
      address: user.address,
      phone: user.phone,
      email: user.email
    }
  });
}

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}


