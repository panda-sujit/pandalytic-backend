const Joi = require('joi');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 10,
    required: true
  },
  slug: {
    type: String,
    trim: true,
    minlength: 10,
  },
  imageUri: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 120
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
  publishedBy: {
    type: String,
    trim: true,
    required: true,
    minlength: 10,
    maxlength: 120
  },
  isActive: {
    type: Boolean,
    default: false
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

const Blog = mongoose.model('Blog', blogSchema);

const validateBlogInfo = (reqBlogInfo) => {
  const schema = Joi.object({
    tag: Joi.array().required(),
    imageUri: Joi.string().allow(''),
    title: Joi.string().min(10).required(),
    description: Joi.string().min(120).required(),
    readMin: Joi.string().min(1).max(255).required(),
    publishedBy: Joi.string().min(10).max(120).required(),
  });
  return schema.validate(reqBlogInfo);
}

exports.Blog = Blog;
exports.blogSchema = blogSchema;
exports.validate = validateBlogInfo;
