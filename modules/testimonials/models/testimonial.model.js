const Joi = require('joi');
const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema({
  imageUri: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: true,
  },
  messageBy: {
    type: String,
    maxlength: 50,
    required: true
  },
  designation: {
    type: String,
    maxlength: 50,
    required: true
  },
  organization: {
    type: String,
    maxlength: 50,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
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

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

const validateTestimonialInfo = (reqTestimonialInfo) => {
  const schema = Joi.object({
    imageUri: Joi.string().allow(''),
    message: Joi.string().required(),
    organization: Joi.string().max(50),
    messageBy: Joi.string().max(50).required(),
    designation: Joi.string().max(50).required(),
  });
  return schema.validate(reqTestimonialInfo);
}

exports.Testimonial = Testimonial;
exports.testimonialSchema = testimonialSchema;
exports.validateTestimonialInfo = validateTestimonialInfo;
