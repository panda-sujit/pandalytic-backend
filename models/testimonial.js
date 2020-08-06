const Joi = require('joi');
const mongoose = require('mongoose')

const testimonialSchema = new mongoose.Schema({
  imageUri: {
    type: String,
    required: false
  },
  message: {
    type: String,
    minlength: 120,
    required: true,
  },
  messageBy: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  designation: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  organization: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false,
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

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

const validateTestimonialInfo = (reqTestimonialInfo) => {
  const schema = Joi.object({
    imageUri: Joi.string().allow(''),
    message: Joi.string().min(120).required(),
    messageBy: Joi.string().min(5).max(50).required(),
    designation: Joi.string().min(5).max(50).required(),
    organization: Joi.string().min(5).max(50),
  });
  return schema.validate(reqTestimonialInfo);
}

exports.Testimonial = Testimonial;
exports.testimonialSchema = testimonialSchema;
exports.validateTestimonialInfo = validateTestimonialInfo;
