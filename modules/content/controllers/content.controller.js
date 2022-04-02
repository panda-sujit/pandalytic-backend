const httpStatus = require('http-status');
const cloudinary = require('cloudinary');

const commonHelper = require('../../../helpers/common.helper');
const covertToSlug = require('../../../helpers/slugify');

const {
  Content,
  validateContentInfo
} = require('../models/content.model');

/* ****************************************
 *
 * REST API Controller for Content
 *
 * ****************************************/

exports.getContentListWithAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    populate = [
      // {
      //   path: 'user',
      //   model: 'User',
      //   select: 'name'
      // },
    ]

    selectQuery = 'title description slug imageUri isActive isDeleted createdBy createdAt updatedAt updatedBy';

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let contentList = await commonHelper.getQueryRequest(Content, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, contentList.data, 'Content List get successfully.', page, limit, contentList.totalData, contentList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getContentListWithoutAuthToken = async (req, res) => {
  try {
    let { populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);
    populate = [
      // {
      //   path: 'user',
      //   model: 'User',
      //   select: 'name'
      // },
    ]

    selectQuery = 'title description slug imageUri createdAt';

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

    let contentList = await Content
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, contentList, 'Content get successfully.', null, null, null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postContentInfo = async (req, res) => {
  try {
    let result;
    const { error } = validateContentInfo(req.body);
    if (error) throw error;

    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.body.imageUri = result.secure_url;
    }

    req.body.slug = covertToSlug(req.body.title);

    const newContentObj = new Content(req.body);

    const savedData = await newContentObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Content have been save successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

exports.deleteContentInfoById = async (req, res) => {
  try {
    const contentInfoObj = await Content.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date(),
      }
    });
    if (!contentInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, contentInfoObj, null, 'The content info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, contentInfoObj, null, 'Content info is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getContentInfoById = async (req, res) => {
  try {
    const contentInfoObj = await Content.findById(req.params.id);
    if (!contentInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, contentInfoObj, null, 'The content info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, contentInfoObj, null, 'Content info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updateContentInfoById = async (req, res) => {
  try {
    let result;
    req.body.updatedAt = new Date();

    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.body.imageUri = result.secure_url;
    }

    if (req.body.title) {
      req.body.slug = covertToSlug(req.body.title);
    }

    const updateContentInfoObj = await Content.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    )
    if (!updateContentInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updateContentInfoObj, null, 'The content info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updateContentInfoObj, null, 'The content info with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getContentBySlug = async (req, res) => {
  try {
    const contentObj = await Content.find({ slug: req.params.slug })

    if (!contentObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, contentObj, null, 'The content info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, contentObj, null, 'Content info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}