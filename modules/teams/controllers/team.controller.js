const cloudinary = require('cloudinary');
const httpStatus = require('http-status');

const commonHelper = require('../../../helpers/common.helper');

const { Team, validate } = require('../models/team.model');

const {
  TeamCategory,
  validateTeamCategoryInfo
} = require('../models/teamCategory.model');

/* ****************************************
 *
 * REST API Controller for Team
 *
 * ****************************************/

exports.getTeamListWithAuthToken = async (req, res) => {
  try {
    let {
      page,
      limit,
      populate,
      selectQuery,
      searchQuery,
      sortQuery
    } = commonHelper.parseFilters(req, 10, false);
    populate = [
      {
        path: 'teamCategory',
        model: 'TeamCategory',
        select: 'title'
      }
    ];

    selectQuery =
      'name designation shortDescription teamCategory imageUri media joinDate isActive isDeleted createdBy createdAt updatedAt updatedBy';
    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i'
        },
        ...searchQuery
      };
    }
    let teamList = await commonHelper.getQueryRequest(
      Team,
      page,
      limit,
      sortQuery,
      searchQuery,
      selectQuery,
      populate
    );

    return commonHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      teamList.data,
      'Team List get successfully.',
      page,
      limit,
      teamList.totalData,
      teamList.totalPages
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

exports.getTeamListWithoutAuthToken = async (req, res) => {
  try {
    let {
      populate,
      selectQuery,
      searchQuery,
      sortQuery
    } = commonHelper.parseFilters(req, 12, false);
    populate = [
      {
        path: 'teamCategory',
        model: 'TeamCategory',
        select: 'title'
      }
    ];

    selectQuery =
      'name designation shortDescription teamCategory imageUri media joinDate createdAt';

    searchQuery = {
      isActive: true,
      ...searchQuery
    };
    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i'
        },
        ...searchQuery
      };
    }

    sortQuery = { joinDate: 1 };

    let teamList = await Team.find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    let teamCategories = await TeamCategory.find({ isActive: true }).select(
      'title'
    );

    let categoriedDataObj = new Object();
    teamCategories.map(teamCategory => {
      let arrList = new Array();
      teamList.map(team => {
        if (teamCategory.title === team.teamCategory.title) {
          arrList.push(team);
        }
      });
      categoriedDataObj[teamCategory.title] = arrList;
    });

    return commonHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      categoriedDataObj,
      'Team List get successfully.',
      null,
      null,
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

exports.postTeamInfo = async (req, res) => {
  try {
    let result;
    const { error } = validate(req.body);
    if (error) throw error;

    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.body.imageUri = result.secure_url;
    }

    const newTeamObj = new Team(req.body);
    const savedData = await newTeamObj.save();
    return commonHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      savedData,
      null,
      'Team Member has been save successfully.',
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error.details[0].message,
      null
    );
  }
};

exports.deleteTeamInfoById = async (req, res) => {
  try {
    const teamMemberDetailObj = await Team.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date()
      }
    });
    if (!teamMemberDetailObj)
      return commonHelper.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        true,
        teamMemberDetailObj,
        null,
        'The team member details with the given ID was not found.',
        null
      );
    return commonHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      teamMemberDetailObj,
      null,
      'Team Member Details is deleted successfully.',
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

exports.getTeamInfoById = async (req, res) => {
  try {
    const teamMemberDetailObj = await Team.findById(req.params.id).populate([
      { path: 'teamCategory', model: 'TeamCategory', select: 'title' }
    ]);
    if (!teamMemberDetailObj)
      return commonHelper.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        true,
        teamMemberDetailObj,
        null,
        'The team category with the given ID was not found.',
        null
      );
    return commonHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      teamMemberDetailObj,
      null,
      'Team Member Details Found.',
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

exports.updateTeamInfoById = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    // req.body.updatedBy = req.user.id;
    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.body.imageUri = result.secure_url;
    }
    const updatedTeamMemberDetailObj = await Team.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    if (!updatedTeamMemberDetailObj)
      return commonHelper.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        true,
        updatedTeamMemberDetailObj,
        null,
        'The team member detail with the given ID was not found.',
        null
      );
    return commonHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      updatedTeamMemberDetailObj,
      null,
      'The team member detail with the given ID is updated successfully.',
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

/* ****************************************
 *
 * REST API Controller for Team Category
 *
 * ****************************************/

exports.getTeamCategoryWithAuthToken = async (req, res) => {
  try {
    let {
      page,
      limit,
      populate,
      selectQuery,
      searchQuery,
      sortQuery
    } = commonHelper.parseFilters(req, 10, false);

    selectQuery =
      'title description isActive isDeleted createdBy createdAt updatedAt updatedBy';
    if (req.query.title) {
      searchQuery = {
        title: {
          $regex: req.query.title,
          $options: 'i'
        },
        ...searchQuery
      };
    }
    let teamCategory = await commonHelper.getQueryRequest(
      TeamCategory,
      page,
      limit,
      sortQuery,
      searchQuery,
      selectQuery,
      populate
    );

    return commonHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      teamCategory.data,
      'Team Category get successfully.',
      page,
      limit,
      teamCategory.totalData,
      teamCategory.totalPages
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

exports.getTeamCategoryWithoutAuthToken = async (req, res) => {
  try {
    let { selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(
      req,
      12,
      false
    );

    selectQuery = 'title description createdAt';

    searchQuery = {
      isActive: true,
      ...searchQuery
    };
    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i'
        },
        ...searchQuery
      };
    }

    let teamCategory = await TeamCategory.find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery);
    return commonHelper.paginationSendResponse(
      res,
      httpStatus.OK,
      true,
      teamCategory,
      'Team Category get successfully.',
      null,
      null,
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

exports.postTeamCategory = async (req, res) => {
  try {
    const { error } = validateTeamCategoryInfo(req.body);
    if (error) throw error;

    const newTeamCategory = new TeamCategory(req.body);
    const savedData = await newTeamCategory.save();
    return commonHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      savedData,
      null,
      'Team Category has been created successfully.',
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error.details[0].message,
      null
    );
  }
};

exports.deleteTeamCategoryById = async (req, res) => {
  try {
    const teamCategory = await TeamCategory.findByIdAndUpdate(req.params.id, {
      $set: {
        isDeleted: true,
        deletedAt: new Date()
      }
    });
    if (!teamCategory)
      return commonHelper.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        true,
        teamCategory,
        null,
        'The team category with the given ID was not found.',
        null
      );
    return commonHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      teamCategory,
      null,
      'Team Category is deleted successfully.',
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

exports.getTeamCategoryById = async (req, res) => {
  try {
    const teamCategory = await TeamCategory.findById(req.params.id);
    if (!teamCategory)
      return commonHelper.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        true,
        teamCategory,
        null,
        'The team category with the given ID was not found.',
        null
      );
    return commonHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      teamCategory,
      null,
      'Team Category Found.',
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

exports.updateTeamCategoryById = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    req.body.updatedBy = req.user.id;
    const updatedTeamCategory = await TeamCategory.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    if (!updatedTeamCategory)
      return commonHelper.sendResponse(
        res,
        httpStatus.NOT_FOUND,
        true,
        updatedTeamCategory,
        null,
        'The team category with the given ID was not found.',
        null
      );
    return commonHelper.sendResponse(
      res,
      httpStatus.OK,
      true,
      updatedTeamCategory,
      null,
      'The team category with the given ID is updated successfully.',
      null
    );
  } catch (error) {
    return commonHelper.sendResponse(
      res,
      httpStatus.INTERNAL_SERVER_ERROR,
      false,
      [],
      null,
      error,
      null
    );
  }
};

// exports.deleteTeamCategoryByIdPermanently = async (req, res) => {
//   try {
//     const teamCategory = await TeamCategory.findByIdAndRemove(req.params.id);
//     if (!teamCategory) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, teamCategory, null, 'The team category with the given ID was not found.', null);
//     return commonHelper.sendResponse(res, httpStatus.OK, true, teamCategory, null, 'Team Category is deleted Permanently.', null);
//   } catch (error) {
//     return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
//   }
// }
