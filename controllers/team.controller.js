const cloudinary = require('cloudinary');

const { Team, validate } = require('../models/team');
const { TeamCategory, validateTeamCategoryInfo } = require('../models/teamCategory');


exports.getTeamInfo = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const teamInfoList = await Team.find()
      .populate([
        { path: 'teamCategory', model: 'TeamCategory', select: 'title' },
      ])
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Team.countDocuments();

    return res.status(200).send({
      teamInfoList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Error', err.message);
  }
}

exports.postTeamInfo = async (req, res) => {
  let result;
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  try {
    result = await cloudinary.v2.uploader.upload(req.file.path);
  } catch (exceptionError) {
    return res.status(400).send({
      error: exceptionError,
      message: 'Error while uploading image please try again later.'
    });
  }

  const team = new Team({
    name: req.body.name,
    designation: req.body.designation,
    imageUri: result.secure_url,
    shortDescription: req.body.shortDescription,
    teamCategory: req.body.teamCategory,
    media: req.body.media
  });
  const savedData = await team.save();
  return res.status(200).send({ message: 'Team info has been save successfully.', result: savedData });
}

exports.deleteTeamInfo = async (req, res) => {
  const teamInfo = await Team.findByIdAndRemove(req.params.id);
  if (!teamInfo) return res.status(404).send('The team info with the given ID was not found.');
  res.status(200).send({ message: 'Data is deleted successfully.', result: teamInfo });
}

exports.getTeamInfoById = async (req, res) => {
  const teamInfo = await Team.findById(req.params.id);
  if (!teamInfo) return res.status(404).send('The team info with the given ID was not found.');
  res.status(200).send(teamInfo);
}

exports.updateTeamInfo = async (req, res) => {
  let result;
  const response = await Team.findById(req.params.id);

  if (!response) return res.status(404).send('The team info with the given ID was not found.');

  if (req.file) {
    try {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      req.body['imageUri'] = result.secure_url;
    } catch (exceptionError) {
      return res.status(400).send({
        error: exceptionError,
        message: 'Error while uploading image please try again later.'
      });
    }
  }
  req.body['updatedAt'] = Date.now();

  const teamInfoUpdated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!teamInfoUpdated) return res.status(404).send('The team info with the given ID was not found.');
  res.status(200).send({ message: 'The team info with the given ID is updated successfully.', result: teamInfoUpdated });
}

exports.getTeamCategory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const teamCategoryList = await TeamCategory.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await TeamCategory.countDocuments();

    return res.status(200).send({
      teamCategoryList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Error', err.message);
  }
}

exports.postTeamCategory = async (req, res) => {
  const { error } = validateTeamCategoryInfo(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const teamCategory = new TeamCategory(req.body);
  const savedData = await teamCategory.save();
  return res.status(200).send({ message: 'Team Category has been created successfully.', result: savedData });
}

exports.deleteTeamCategoryById = async (req, res) => {
  const teamCategory = await TeamCategory.findByIdAndRemove(req.params.id);
  if (!teamCategory) return res.status(404).send('The team category with the given ID was not found.');
  res.status(200).send({ message: 'Data is deleted successfully.', result: teamCategory });
}

exports.getTeamCategoryById = async (req, res) => {
  const teamCategory = await TeamCategory.findById(req.params.id);
  if (!teamCategory) return res.status(404).send('The team category with the given ID was not found.');
  res.status(200).send(teamCategory);
}

exports.updateTeamCategoryById = async (req, res) => {
  req.body['updatedAt'] = Date.now();
  const teamCategoryUpdated = await TeamCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!teamCategoryUpdated) return res.status(404).send('The team category with the given ID was not found.');
  res.status(200).send({ message: 'The team category with the given ID is updated successfully.', result: teamCategoryUpdated });
}

