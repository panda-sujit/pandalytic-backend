const cloudinary = require('cloudinary');
const httpStatus = require('http-status');

const commonHelper = require('../../../helpers/common.helper');

const {
  Testimonial,
  validateTestimonialInfo
} = require('../models/testimonial.model');


/* ****************************************
 *
 * REST API Controller for Testimonial
 *
 * ****************************************/

exports.getTestimonialListWithAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'message messageBy designation imageUri organization isActive isDeleted createdBy createdAt updatedAt updatedBy';

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let testimonialList = await commonHelper.getQueryRequest(Testimonial, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, testimonialList.data, 'Testimonial List get successfully.', page, limit, testimonialList.totalData, testimonialList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getTestimonialListWithoutAuthToken = async (req, res) => {
  try {
    let { populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);
    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'message messageBy designation imageUri organization createdAt';

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

    let testimonialList = await Testimonial
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, testimonialList, 'Testimonial get successfully.', null, null, null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postTestimonialInfo = async (req, res) => {
  try {
    let result;
    const { error } = validateTestimonialInfo(req.body);
    if (error) throw error;

    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.body.imageUri = result.secure_url;
    }

    const newTestimonialObj = new Testimonial(req.body);
    const savedData = await newTestimonialObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Testimonial have been save successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

exports.deleteTestimonialInfoById = async (req, res) => {
  try {
    const testimonialInfoObj = await Testimonial.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date(),
      }
    });
    if (!testimonialInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, testimonialInfoObj, null, 'The testimonial info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, testimonialInfoObj, null, 'Testimonial info is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getTestimonialInfoById = async (req, res) => {
  try {
    const testimonialInfoObj = await Testimonial
      .findById(req.params.id)
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!testimonialInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, testimonialInfoObj, null, 'The testimonial info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, testimonialInfoObj, null, 'Testimonial info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updateTestimonialInfoById = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.bodt.imageUri = result.secure_url;
    }

    const updateTestimonialInfoObj = await Testimonial.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    )
    if (!updateTestimonialInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updateTestimonialInfoObj, null, 'The testimonial info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updateTestimonialInfoObj, null, 'The testimonial info with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

