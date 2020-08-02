const cloudinary = require('cloudinary');

const { Team, validate } = require('../models/team');



exports.getTeamInfo = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const teamInfoList = await Team.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Team.countDocuments();

    res.status(200).send({
      teamInfoList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
  }

  res.status(200).send(team);
}

exports.postTeamInfo = async (req, res) => {
  let result;
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  try {
    result = await cloudinary.v2.uploader.upload(req.file.path);
  } catch (exceptionError) {
    return res.status(400).send({
      error: exceptionError,
      message: 'Error while uploading image please try again later.'
    });
  }

  const team = new Team({
    name: req.body.name,
    designation: req.body.designation,
    imageUri: result.secure_url,
    shortDescription: req.body.shortDescription,
    media: req.body.media
  });
  await team.save();
  return res.status(200).send('Team info has been save successfully. But wont appear on home screen until Admin verified it');
}

exports.deleteTeamInfo = async (req, res) => {
  const teamInfo = await Team.findByIdAndRemove(req.params.id);
  if (!teamInfo) return res.status(404).send('The team info with the given ID was not found.');
  res.status(200).send(teamInfo);
}

exports.getTeamInfoById = async (req, res) => {
  const teamInfo = await Team.findById(req.params.id);
  if (!teamInfo) return res.status(404).send('The team info with the given ID was not found.');
  res.status(200).send(teamInfo);
}

exports.updateTeamInfo = async (req, res) => {
  let result;
  const response = await Team.findById(req.params.id);

  if (!response) return res.status(404).send('The team info with the given ID was not found');

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

  const teamInfoUpdated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!teamInfoUpdated) return res.status(404).send('The team info with the given ID was not found');
  res.status(200).send(teamInfoUpdated);
}

