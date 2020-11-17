const httpStatus = require('http-status');

const commonHelper = require('../../../helpers/common.helper');

const {
  Pricing,
  validate
} = require('../models/pricing.model');

/* ****************************************
 *
 * REST API Controller for Pricing
 *
 * ****************************************/


exports.getPricingListWithAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'pricingCategory pricingRatePerMonth pricingRatePerYear features isActive isDeleted createdBy createdAt updatedAt updatedBy';

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let pricingList = await commonHelper.getQueryRequest(Pricing, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, pricingList.data, 'Pricing List get successfully.', page, limit, pricingList.totalData, pricingList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getPricingListWithoutAuthToken = async (req, res) => {
  try {
    let { populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);
    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'pricingCategory pricingRatePerMonth pricingRatePerYear features createdAt';

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

    let pricingList = await Pricing
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, pricingList, 'Pricing get successfully.', null, null, null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postPricingInfo = async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) throw error;

    const newPricingObj = new Pricing(req.body);
    const savedData = await newPricingObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Pricing have been save successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

exports.deletePricingInfoById = async (req, res) => {
  try {
    const pricingInfoObj = await Pricing
      .findByIdAndUpdate(req.params.id, {
        $set: {
          isActive: false,
          isDeleted: true,
          deletedAt: new Date(),
        }
      });
    if (!pricingInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, pricingInfoObj, null, 'The pricing info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, pricingInfoObj, null, 'Pricing info is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getPricingInfoById = async (req, res) => {
  try {
    const pricingInfoObj = await Pricing
      .findById(req.params.id)
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!pricingInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, pricingInfoObj, null, 'The pricing info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, pricingInfoObj, null, 'Pricing info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updatePricingInfoById = async (req, res) => {
  try {
    req.body.updatedAt = new Date();

    const updatePricingInfoObj = await Pricing
      .findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true
        }
      )
    if (!updatePricingInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updatePricingInfoObj, null, 'The pricing info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updatePricingInfoObj, null, 'The pricing info with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

