const cloudinary = require('cloudinary');
const httpStatus = require('http-status');

const commonHelper = require('../../../helpers/common.helper');

const { Project, validateProjectInfo } = require('../models/project.model');

/* ****************************************
 *
 * REST API Controller for Project
 *
 * ****************************************/

exports.getProjectListWithAuthToken = async (req, res) => {
  try {
    let { page, limit, populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);

    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'projectTitle projectDescription projectLink imageUri tag isActive isDeleted createdBy createdAt updatedAt updatedBy';

    if (req.query.name) {
      searchQuery = {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
        ...searchQuery,
      };
    }

    let projectList = await commonHelper.getQueryRequest(Project, page, limit, sortQuery, searchQuery, selectQuery, populate);
    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, projectList.data, 'Project List get successfully.', page, limit, projectList.totalData, projectList.totalPages);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getProjectListWithoutAuthToken = async (req, res) => {
  try {
    let { populate, selectQuery, searchQuery, sortQuery } = commonHelper.parseFilters(req, 12, false);
    populate = [
      {
        path: 'user',
        model: 'User',
        select: 'name'
      },
    ]

    selectQuery = 'projectTitle projectDescription projectLink imageUri tag createdAt';

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

    let projectList = await Project
      .find(searchQuery)
      .select(selectQuery)
      .sort(sortQuery)
      .populate(populate);

    return commonHelper.paginationSendResponse(res, httpStatus.OK, true, projectList, 'Project get successfully.', null, null, null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.postProjectInfo = async (req, res) => {
  try {
    let result;
    const { error } = validateProjectInfo(req.body);
    if (error) throw error;

    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.body.imageUri = result.secure_url;
    }

    const newProjectObj = new Project(req.body);
    const savedData = await newProjectObj.save();
    return commonHelper.sendResponse(res, httpStatus.OK, true, savedData, null, 'Project have been save successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error.details[0].message, null);
  }
}

// exports.deleteProjectPermanentlyById = async (req, res) => {
//   const project = await Project.findByIdAndRemove(req.params.id);
//   if (!project) return res.status(404).send('The project with the given ID was not found.');
//   res.status(200).send({ message: 'Data is deleted successfully', result: project });
// }

exports.deleteProjectInfoById = async (req, res) => {
  try {
    const projectInfoObj = await Project.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
        isDeleted: true,
        deletedAt: new Date(),
      }
    });
    if (!projectInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, projectInfoObj, null, 'The project info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, projectInfoObj, null, 'Project info is deleted successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.getProjectInfoById = async (req, res) => {
  try {
    const projectInfoObj = await Project
      .findById(req.params.id)
      .populate([
        { path: 'user', model: 'User', select: 'name' },
      ]);
    if (!projectInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, projectInfoObj, null, 'The project info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, projectInfoObj, null, 'Project info found.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
}

exports.updateProjectInfoById = async (req, res) => {
  try {
    req.body.updatedAt = new Date();
    if (req.file) {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      if (!result) throw error;
      req.bodt.imageUri = result.secure_url;
    }

    const updateProjectInfoObj = await Project.findOneAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true
      }
    )
    if (!updateProjectInfoObj) return commonHelper.sendResponse(res, httpStatus.NOT_FOUND, true, updateProjectInfoObj, null, 'The project info with the given ID was not found.', null);
    return commonHelper.sendResponse(res, httpStatus.OK, true, updateProjectInfoObj, null, 'The project info with the given ID is updated successfully.', null);
  } catch (error) {
    return commonHelper.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, [], null, error, null);
  }
  let result;
  const response = await Project.findById(req.params.id);

  if (!response) return res.status(404).send('The project info with the given ID was not found.');

  if (req.file) {
    try {
      result = await cloudinary.v2.uploader.upload(req.file.path);
      req.body['imageUri'] = result.secure_url;
    } catch (exceptionError) {
      return res.status(400).send({
        error: exceptionError,
        message: 'Error while uploading image please try again later.'
      });
    }
  }
  req.body['updatedAt'] = Date.now();

  const projectUpdated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!projectUpdated) return res.status(404).send('The project info with the given ID was not found.');
  res.status(200).send({ message: 'The project info with the given ID is updated successfully.', result: projectUpdated });
}

