const Joi = require('joi');
const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  organization: {
    type: String,
  },
  message: {
    type: String,
    minlength: 120,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

const validateContactUs = (reqContactUsQueries) => {
  const schema = Joi.object({
    message: Joi.string().min(120).required(),
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    organization: Joi.string().allow(''),
    email: Joi.string().min(5).max(255).required().email(),
  });
  return schema.validate(reqContactUsQueries);
}

exports.ContactUs = ContactUs;
exports.contactUsSchema = contactUsSchema;
exports.validateContactUs = validateContactUs;

