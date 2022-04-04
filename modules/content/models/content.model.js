const Joi = require('joi');
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true
  },
  imageUri: {
    type: String,
    required: false
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
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

const Content = mongoose.model('Content', contentSchema);

const validateContentInfo = (reqContentInfo) => {
  const schema = Joi.object({
    isActive: Joi.boolean().required(),
    description: Joi.string().required(),
    imageUri: Joi.string().allow(''),
    title: Joi.string().max(120).required(),
    imageFile: Joi.object().allow(null)
  });
  return schema.validate(reqContentInfo);
}

exports.Content = Content;
exports.contentSchema = contentSchema;
exports.validateContentInfo = validateContentInfo;
