const Joi = require('joi');
const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 120,
    required: true,
  },
  tag: {
    type: Array,
    required: true
  },
  opening: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  applyDate: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    minlength: 120,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true
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

const Career = mongoose.model('Career', careerSchema);

const validateCareer = (reqCareerData) => {
  const schema = Joi.object({
    tag: Joi.array().required(),
    applyDate: Joi.allow(''),
    description: Joi.string().min(120).required(),
    title: Joi.string().min(5).max(120).required(),
    opening: Joi.number().min(0).max(255).required(),
  });
  return schema.validate(reqCareerData)
}

exports.Career = Career;
exports.careerSchema = careerSchema;
exports.validateCareer = validateCareer;
