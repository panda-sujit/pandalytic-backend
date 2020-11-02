const cloudinary = require('cloudinary');
const httpStatus = require('http-status');

const commonHelper = require('../../../helpers/common.helper');

const {
  Quote,
  validateQuoteInfo
} = require('../models/quote.model');

/* ****************************************
 *
 * REST API Controller for Quote
 *
 * ****************************************/

exports.getQuoteListWithAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'quote qouteBy imageUri tag isActive isDeleted createdBy createdAt updatedAt updatedBy';

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let quoteList = await commonHelper.getQueryRequest(Quote, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, quoteList.data, 'Quote List get successfully.', page, limit, quoteList.totalData, quoteList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getQuoteListWithoutAuthToken = async (req, res) => {
  try {
    let { populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);
    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'quote quoteBy imageUri tag createdAt';

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

    let quoteList = await Quote
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, quoteList, 'Quote get successfully.', null, null, null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postQuoteInfo = async (req, res) => {
  try {
    let result;
    const { error } = validateQuoteInfo(req.body);
    if (error) throw error;

    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.body.imageUri = result.secure_url;
    }

    const newQuoteObj = new Quote(req.body);
    const savedData = await newQuoteObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Quote have been save successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

// exports.deleteQuotePermanentlyById = async (req, res) => {
//   const quote = await Quote.findByIdAndRemove(req.params.id);
//   if (!quote) return res.status(404).send('The quote with the given ID was not found.');
//   res.status(200).send({ message: 'Data is deleted successfully', result: quote });
// }

exports.deleteQuoteInfoById = async (req, res) => {
  try {
    const quoteInfoObj = await Quote.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date(),
      }
    });
    if (!quoteInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, quoteInfoObj, null, 'The quote info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, quoteInfoObj, null, 'Quote info is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getQuoteInfoById = async (req, res) => {
  try {
    const quoteInfoObj = await Quote
      .findById(req.params.id)
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!quoteInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, quoteInfoObj, null, 'The quote info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, quoteInfoObj, null, 'Quote info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updateQuoteInfoById = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.bodt.imageUri = result.secure_url;
    }

    const updateQuoteInfoObj = await Quote.findOneAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    )
    if (!updateQuoteInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updateQuoteInfoObj, null, 'The quote info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updateQuoteInfoObj, null, 'The quote info with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

