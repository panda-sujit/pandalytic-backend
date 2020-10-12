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

const Project = mongoose.model('Project', projectSchema);

const validateProjectInfo = (reqProjectInfo) => {
  const schema = Joi.object({
    tag: Joi.array().required(),
    imageUri: Joi.string().allow(''),
    projectDescription: Joi.string().required(),
    projectTitle: Joi.string().max(120).required(),
    projectLink: Joi.string().min(5).max(255).allow(''),
  });
  return schema.validate(reqProjectInfo);
}

exports.Project = Project;
exports.projectSchema = projectSchema;
exports.validateProjectInfo = validateProjectInfo;
