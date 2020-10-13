const Joi = require('joi');
const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    maxlength: 255,
    required: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    maxlength: 50
  },
  organization: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: {
    type: Date,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  }
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

const validateContactUs = (reqContactUsQueries) => {
  const schema = Joi.object({
    message: Joi.string().required(),
    organization: Joi.string().allow(''),
    name: Joi.string().max(50).required(),
    phone: Joi.string().max(50).required(),
    email: Joi.string().max(255).required().email(),
  });
  return schema.validate(reqContactUsQueries);
}

exports.ContactUs = ContactUs;
exports.contactUsSchema = contactUsSchema;
exports.validateContactUs = validateContactUs;

