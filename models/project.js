const Joi = require('joi');
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  imageUri: {
    type: String,
    required: false
  },
  projectTitle: {
    type: String,
    maxlength: 120,
    required: true,
  },
  projectDescription: {
    type: String,
    minlength: 120,
    required: true
  },
  projectLink: {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  tag: {
    type: Array,
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

const Project = mongoose.model('Project', projectSchema);

const validateProjectInfo = (reqProjectInfo) => {
  const schema = Joi.object({
    tag: Joi.array().required(),
    imageUri: Joi.string().allow(''),
    projectLink: Joi.string().min(5).max(255).allow(''),
    projectDescription: Joi.string().min(120).required(),
    projectTitle: Joi.string().min(5).max(120).required(),
  });
  return schema.validate(reqProjectInfo);
}

exports.Project = Project;
exports.projectSchema = projectSchema;
exports.validateProjectInfo = validateProjectInfo;
