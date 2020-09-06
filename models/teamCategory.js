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
    required: true,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const TeamCategory = mongoose.model('TeamCategory', teamCategorySchema);

const validateTeamCategoryInfo = (reqTeamInfo) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    isActive: Joi.boolean().required()
  });
  return schema.validate(reqTeamInfo)
}

exports.TeamCategory = TeamCategory;
exports.teamCategorySchema = teamCategorySchema;
exports.validateTeamCategoryInfo = validateTeamCategoryInfo;
