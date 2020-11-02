const Joi = require('joi');
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  imageUri: {
    type: String,
    required: false
  },
  quote: {
    type: String,
    required: true,
  },
  quoteBy: {
    type: String,
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

const Quote = mongoose.model('Quote', quoteSchema);

const validateQuoteInfo = (reqQuoteInfo) => {
  const schema = Joi.object({
    quote: Joi.string().required(),
    quoteBy: Joi.string().required(),
    imageUri: Joi.string().allow(''),
  });
  return schema.validate(reqQuoteInfo);
}

exports.Quote = Quote;
exports.quoteSchema = quoteSchema;
exports.validateQuoteInfo = validateQuoteInfo;
