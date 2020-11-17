const Joi = require('joi');
const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
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
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
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

const Career = mongoose.model('Career', careerSchema);

const validateCareer = (reqCareerData) => {
  const schema = Joi.object({
    tag: Joi.array().required(),
    applyDate: Joi.allow(''),
    isActive: Joi.boolean().required(),
    description: Joi.string().required(),
    title: Joi.string().max(120).required(),
    opening: Joi.number().min(0).max(255).required(),
  });
  return schema.validate(reqCareerData)
}

exports.Career = Career;
exports.careerSchema = careerSchema;
exports.validateCareer = validateCareer;
