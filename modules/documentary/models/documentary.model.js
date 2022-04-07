const Joi = require('joi');
const mongoose = require('mongoose');

const documentarySchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  slug: {
    type: String,
    trim: true,
  },
  imageUri: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: Array,
    required: true
  },
  readMin: {
    type: Number,
    required: true,
    min: 1,
    max: 255
  },
  // publishedBy: {
  //   type: String,
  //   trim: true,
  //   required: true,
  //   maxlength: 120
  // },
  isActive: {
    type: Boolean,
    default: false
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

const Documentary = mongoose.model('Documentary', documentarySchema);

const validateDocumentaryInfo = (reqDocumentaryInfo) => {
  const schema = Joi.object({
    tag: Joi.array().required(),
    title: Joi.string().required(),
    imageUri: Joi.string().allow(''),
    description: Joi.string().required(),
    readMin: Joi.string().min(1).max(255).required(),
  });
  return schema.validate(reqDocumentaryInfo);
}

exports.Documentary = Documentary;
exports.documentarySchema = documentarySchema;
exports.validate = validateDocumentaryInfo;
