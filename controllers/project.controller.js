const cloudinary = require('cloudinary');

const { Project, validateProjectInfo } = require('../models/project');


exports.getProjectList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const projectList = await Project.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Project.countDocuments();

    return res.status(200).send({
      projectList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Error', err.message);
  }
}

exports.postProjectInfo = async (req, res) => {
  let result;
  const { error } = validateProjectInfo(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  try {
    result = await cloudinary.v2.uploader.upload(req.file.path);
  } catch (exceptionError) {
    return res.status(400).send({
      error: exceptionError,
      message: 'Error while uploading image please try again later.'
    });
  }

  const project = new Project({
    imageUri: result.secure_url,
    projectTitle: req.body.projectTitle,
    projectDescription: req.body.projectDescription,
    projectLink: req.body.projectLink,
    tag: req.body.tag
  });
  const savedData = await project.save();
  return res.status(200).send({ message: 'Project has been save successfully.', result: savedData });
}

exports.deleteProjectById = async (req, res) => {
  const project = await Project.findByIdAndRemove(req.params.id);
  if (!project) return res.status(404).send('The project with the given ID was not found.');
  res.status(200).send({ message: 'Data is deleted successfully', result: project });
}

exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).send('The project with the given ID was not found.');
  res.status(200).send(project);
}

exports.updateProjectById = async (req, res) => {
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

