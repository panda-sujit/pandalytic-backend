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

const Pricing = mongoose.model('Pricing', pricingSchema);

const validatePricingInfo = (reqPricingInfo) => {
  const schema = Joi.object({
    pricingCategory: Joi.string().required(),
    pricingRatePerMonth: Joi.number().min(1).required(),
    pricingRatePerYear: Joi.number().min(1).required(),
    features: Joi.array().required(),
  });
  return schema.validate(reqPricingInfo);
}

exports.Pricing = Pricing;
exports.pricingSchema = pricingSchema;
exports.validate = validatePricingInfo;
