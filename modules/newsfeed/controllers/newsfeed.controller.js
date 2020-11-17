const cloudinary = require('cloudinary');
const httpStatus = require('http-status');

const covertToSlug = require('../../../helpers/slugify');
const commonHelper = require('../../../helpers/common.helper');

const {
  NewsFeed,
  validate
} = require('../models/newsfeed.model');

/* ****************************************
 *
 * REST API Controller for News Feed
 *
 * ****************************************/

exports.getNewsFeedListWithAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'title slug description imageUri tag readMin publishedBy isActive isDeleted createdBy createdAt updatedAt updatedBy';

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let newsFeedList = await commonHelper.getQueryRequest(NewsFeed, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, newsFeedList.data, 'News Feed List get successfully.', page, limit, newsFeedList.totalData, newsFeedList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}


exports.getNewsFeedListWithoutAuthToken = async (req, res) => {
  try {
    let { populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);
    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'title slug description imageUri tag readMin publishedBy createdAt';

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

    let newsFeedList = await NewsFeed
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, newsFeedList, 'News feed get successfully.', null, null, null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postNewsFeed = async (req, res) => {
  try {
    let result;
    const { error } = validate(req.body);
    if (error) throw error;

    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.body.imageUri = result.secure_url;
    }

    req.body.slug = covertToSlug(req.body.title);

    const newNewsFeedObj = new NewsFeed(req.body);
    const savedData = await newNewsFeedObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'News Feed have been save successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

exports.deleteNewsFeedById = async (req, res) => {
  try {
    const newsFeedObj = await NewsFeed.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date(),
      }
    });
    if (!newsFeedObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, newsFeedObj, null, 'The news feed info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, newsFeedObj, null, 'News Feed info is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getNewsFeedById = async (req, res) => {
  try {
    const newsFeedObj = await NewsFeed
      .findById(req.params.id)
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!newsFeedObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, newsFeedObj, null, 'The news feed info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, newsFeedObj, null, 'News Feed info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getNewsFeedBySlug = async (req, res) => {
  try {
    const newsFeedObj = await NewsFeed
      .find({ slug: req.params.slug })
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!newsFeedObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, newsFeedObj, null, 'The news feed info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, newsFeedObj, null, 'News Feed info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updateNewsFeedById = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.bodt.imageUri = result.secure_url;
    }

    if (req.body.title) {
      req.body.slug = covertToSlug(req.body.title);
    }

    const updateNewsFeedInfoObj = await NewsFeed.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    )
    if (!updateNewsFeedInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updateNewsFeedInfoObj, null, 'The news feed info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updateNewsFeedInfoObj, null, 'The news feed info with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

