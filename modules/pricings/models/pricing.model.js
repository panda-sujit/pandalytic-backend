const Joi = require('joi');
const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
  pricingCategory: {
    type: String,
    required: true
  },
  pricingRatePerMonth: {
    type: Number,
    required: true,
    min: 1,
  },
  pricingRatePerYear: {
    type: Number,
    required: true,
    min: 1,
  },
  features: [
    {
      title: {
        type: String,
        required: true
      },
      isAvailable: {
        type: Boolean,
        default: false
      }
    }
  ],
  isActive: {
    type: Boolean,
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

const Pricing = mongoose.model('Pricing', pricingSchema);

const validatePricingInfo = (reqPricingInfo) => {
  const schema = Joi.object({
    features: Joi.array().required(),
    pricingCategory: Joi.string().required(),
    pricingRatePerYear: Joi.number().min(1).required(),
    pricingRatePerMonth: Joi.number().min(1).required(),
  });
  return schema.validate(reqPricingInfo);
}

exports.Pricing = Pricing;
exports.pricingSchema = pricingSchema;
exports.validate = validatePricingInfo;
