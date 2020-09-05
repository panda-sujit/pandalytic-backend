const Joi = require('joi');
const mongoose = require('mongoose');

const teamCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
  }
});

const TeamCategory = mongoose.model('TeamCategory', teamCategorySchema);

const validateTeamCategoryInfo = (reqTeamInfo) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
  });
  return schema.validate(reqTeamInfo)
}

exports.TeamCategory = TeamCategory;
exports.teamCategorySchema = teamCategorySchema;
exports.validateTeamCategoryInfo = validateTeamCategoryInfo;
