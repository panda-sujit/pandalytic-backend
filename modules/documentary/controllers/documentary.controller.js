const cloudinary = require('cloudinary');
const httpStatus = require('http-status');

const covertToSlug = require('../../../helpers/slugify');
const commonHelper = require('../../../helpers/common.helper');

const {
  Documentary,
  validate
} = require('../models/documentary.model');

/* ****************************************
 *
 * REST API Controller for Documentary
 *
 * ****************************************/


exports.getDocumentaryListWithAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'title slug description imageUri tag readMin isActive isDeleted createdBy createdAt updatedAt updatedBy';

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let documentaryList = await commonHelper.getQueryRequest(Documentary, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, documentaryList.data, 'Documentary List get successfully.', page, limit, documentaryList.totalData, documentaryList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getDocumentaryListWithoutAuthToken = async (req, res) => {
  try {
    let { populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);
    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'title slug description imageUri tag readMin createdAt';

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

    let documentaryList = await Documentary
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, documentaryList, 'Documentary get successfully.', null, null, null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postDocumentary = async (req, res) => {
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

    const newDocumentaryObj = new Documentary(req.body);
    const savedData = await newDocumentaryObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Documentary have been save successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

exports.deleteDocumentaryById = async (req, res) => {
  try {
    const documentaryObj = await Documentary.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date(),
      }
    });
    if (!documentaryObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, documentaryObj, null, 'The documentary info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, documentaryObj, null, 'Documentary info is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getDocumentaryById = async (req, res) => {
  try {
    const documentaryObj = await Documentary
      .findById(req.params.id)
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!documentaryObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, documentaryObj, null, 'The documentary info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, documentaryObj, null, 'Documentary info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getDocumentaryBySlug = async (req, res) => {
  try {
    const documentaryObj = await Documentary
      .find({ slug: req.params.slug })
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!documentaryObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, documentaryObj, null, 'The documentary info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, documentaryObj, null, 'Documentary info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updateDocumentaryById = async (req, res) => {
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

    const updateDocumentaryInfoObj = await Documentary.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    )
    if (!updateDocumentaryInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updateDocumentaryInfoObj, null, 'The documentary info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updateDocumentaryInfoObj, null, 'The documentary info with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}
