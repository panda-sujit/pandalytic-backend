const httpStatus = require('http-status');

const commonHelper = require('../../../helpers/common.helper');

const {
  Career,
  validateCareer
} = require('../models/career.model');

/* ****************************************
 *
 * REST API Controller for Career
 *
 * ****************************************/


exports.getCareerListWithoutAuthToken = async (req, res) => {
  try {
    let { populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);
    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'title opening applyDate description experience tag createdAt';

    searchQuery = {
      isActive: true,
      ...searchQuery,
    };

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let careerList = await Career
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, careerList, 'Career get successfully.', null, null, null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getCareerListWithAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'title opening applyDate description experience tag isActive isDeleted createdBy createdAt updatedAt updatedBy';

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let careerList = await commonHelper.getQueryRequest(Career, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, careerList.data, 'Career List get successfully.', page, limit, careerList.totalData, careerList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postCareerInfo = async (req, res) => {
  try {
    const { error } = validateCareer(req.body);
    if (error) throw error;

    const newCareerObj = new Career(req.body);
    const savedData = await newCareerObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Career have been save successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

exports.getCareerInfoById = async (req, res) => {
  try {
    const careerInfoObj = await Career
      .findById(req.params.id)
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!careerInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, careerInfoObj, null, 'The career info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, careerInfoObj, null, 'Career info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.deleteCareerInfoById = async (req, res) => {
  try {
    const careerInfoObj = await Career.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date(),
      }
    });
    if (!careerInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, careerInfoObj, null, 'The career info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, careerInfoObj, null, 'Career info is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updateCareerInfoById = async (req, res) => {
  try {
    req.body.updatedAt = new Date();

    const updateCareerInfoObj = await Career.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    )
    if (!updateCareerInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updateCareerInfoObj, null, 'The career info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updateCareerInfoObj, null, 'The career info with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

