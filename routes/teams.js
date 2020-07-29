const express = require('express');
// const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateObjId = require('../middleware/validateObjectId');

require('../middleware/cloudinary')
const upload = require('../middleware/multer');

const { Team, validate } = require('../models/team');

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  const team = await Team.find().sort('name');
  res.status(200).send(team);
}));

router.post('/', [auth, upload.single('imageFile')], asyncMiddleware(async (req, res) => {
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
}));

// router.put('/:id', [auth, validateObjId], asyncMiddleware(async(req, res) => {
//   const {error} = validate(req.body);
//   if(error) return res.status(400).send(error.details[0].message);
// }));

router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(async (req, res) => {
  const teamInfo = await Team.findByIdAndRemove(req.params.id);
  if (!teamInfo) return res.status(404).send('The team info with the given ID was not found.');
  res.status(200).send(teamInfo);
}));

router.get('/:id', validateObjId, asyncMiddleware(async (req, res) => {
  const teamInfo = await Team.findById(req.params.id);
  if (!teamInfo) return res.status(404).send('The team info with the given ID was not found.');
  res.status(200).send(teamInfo);
}));

module.exports = router;
