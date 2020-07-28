const Joi = require('joi');
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  imageUri: {
    type: String,
    required: false
  },
  designation: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  shortDescription: {
    type: String,
    minlength: 120,
    required: true,
  },
  media: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
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

const Team = mongoose.model('Team', teamSchema);

const validateTeamInfo = (reqTeamInfo) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    designation: Joi.string().min(5).max(50).required(),
    imageUri: Joi.string().allow(''),
    shortDescription: Joi.string().min(120).required(),
    media: Joi.object()
  });
  return schema.validate(reqTeamInfo)
}

exports.Team = Team;
exports.teamSchema = teamSchema;
exports.validate = validateTeamInfo;
