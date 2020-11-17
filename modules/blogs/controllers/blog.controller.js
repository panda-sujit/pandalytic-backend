const cloudinary = require('cloudinary');
const httpStatus = require('http-status');

const covertToSlug = require('../../../helpers/slugify');
const commonHelper = require('../../../helpers/common.helper');

const {
  Blog,
  validate
} = require('../models/blog.model');

/* ****************************************
 *
 * REST API Controller for Blog
 *
 * ****************************************/


exports.getBlogListWithAuthToken = async (req, res) => {
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

    let blogList = await commonHelper.getQueryRequest(Blog, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, blogList.data, 'Blog List get successfully.', page, limit, blogList.totalData, blogList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getBlogListWithoutAuthToken = async (req, res) => {
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

    let blogList = await Blog
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, blogList, 'Blog get successfully.', null, null, null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postBlog = async (req, res) => {
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

    const newBlogObj = new Blog(req.body);
    const savedData = await newBlogObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Blog have been save successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

exports.deleteBlogById = async (req, res) => {
  try {
    const blogObj = await Blog.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date(),
      }
    });
    if (!blogObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, blogObj, null, 'The blog info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, blogObj, null, 'Blog info is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getBlogById = async (req, res) => {
  try {
    const blogObj = await Blog
      .findById(req.params.id)
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!blogObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, blogObj, null, 'The blog info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, blogObj, null, 'Blog info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getBlogBySlug = async (req, res) => {
  try {
    const blogObj = await Blog
      .find({ slug: req.params.slug })
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!blogObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, blogObj, null, 'The blog info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, blogObj, null, 'Blog info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updateBlogById = async (req, res) => {
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

    const updateBlogInfoObj = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    )
    if (!updateBlogInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updateBlogInfoObj, null, 'The blog info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updateBlogInfoObj, null, 'The blog info with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

