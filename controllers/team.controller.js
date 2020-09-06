const cloudinary = require('cloudinary');
const httpStatus = require('http-status');

const commonHelper = require('../helpers/common.helper');

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

exports.getTeamCategoryWithAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 10, false);

    selectQuery = 'title description isActive isDeleted createdBy createdAt updatedAt updatedBy';
    if (req.query.title) {
      searchQuery = {
        title: {
          $regex: req.query.title,
          $options: 'i',
        },
        ...searchQuery,
      };
    }
    let teamCategory = await commonHelper.getQueryRequest(TeamCategory, page, limit, sortQuery, searchQuery, selectQuery, populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, teamCategory.data, 'Team Category get successfully.', page, limit, teamCategory.totalData);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getTeamCategoryWithoutAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    selectQuery = 'title description createdAt';

    searchQuery = {
      isActive: true,
      ...searchQuery,
    };
    if (req.query.title) {
      searchQuery = {
        title: {
          $regex: req.query.title,
          $options: 'i',
        },
        ...searchQuery,
      };
    }
    let teamCategory = await commonHelper.getQueryRequest(TeamCategory, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, teamCategory.data, 'Team Category get successfully.', page, limit, teamCategory.totalData);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postTeamCategory = async (req, res) => {
  try {
    const { error } = validateTeamCategoryInfo(req.body);
    if (error) throw error;

    const newTeamCategory = new TeamCategory(req.body);
    const savedData = await newTeamCategory.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Team Category has been created successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

exports.deleteTeamCategoryById = async (req, res) => {
  try {
    const teamCategory = await TeamCategory.findByIdAndUpdate(req.params.id, {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    if (!teamCategory) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, teamCategory, null, 'The team category with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, teamCategory, null, 'Team Category is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }

}

exports.deleteTeamCategoryByIdPermanently = async (req, res) => {
  try {
    const teamCategory = await TeamCategory.findByIdAndRemove(req.params.id);
    if (!teamCategory) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, teamCategory, null, 'The team category with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, teamCategory, null, 'Team Category is deleted Permanently.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getTeamCategoryById = async (req, res) => {
  try {
    const teamCategory = await TeamCategory.findById(req.params.id);
    if (!teamCategory) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, teamCategory, null, 'The team category with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, teamCategory, null, 'Team Category Founded', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updateTeamCategoryById = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    req.body.updatedBy = req.user.id;
    const updatedTeamCategory = await TeamCategory.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );
    if (!updatedTeamCategory) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updatedTeamCategory, null, 'The team category with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updatedTeamCategory, null, 'The team category with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

