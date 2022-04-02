const httpStatus = require('http-status');

const commonHelper = require('../../../helpers/common.helper');

const {
  ContactUs,
  validateContactUs
} = require('../models/contactus.model');


/* ****************************************
 *
 * REST API Controller for Contact Us
 *
 * ****************************************/


exports.getContactUsQueries = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'name email phone organization message isActive isDeleted createdBy createdAt updatedAt updatedBy';

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let contactusList = await commonHelper.getQueryRequest(ContactUs, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, contactusList.data, 'Contact Us List get successfully.', page, limit, contactusList.totalData, contactusList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postContactUsQueries = async (req, res) => {
  try {
    const { error } = validateContactUs(req.body);
    if (error) throw error;

    const newQueryObj = new ContactUs(req.body);
    const savedData = await newQueryObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Queries have been save successfully.', null);
  } catch (error) {
    // console.log(error)
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

exports.getContactUsQueriesById = async (req, res) => {
  try {
    const queriesObj = await ContactUs
      .findById(req.params.id)
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!queriesObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, queriesObj, null, 'The query info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, queriesObj, null, 'Query info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}
