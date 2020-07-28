const express = require('express');
// const mongoose = require('mongoose');
const cloudinary = require('cloudinary');

const auth = require('../middleware/auth');
const asyncMiddleware = require('../middleware/async');

require('../middleware/cloudinary')
const upload = require('../middleware/multer');

const { Team, validate } = require('../models/team');

const router = express.Router();

router.post('/', [auth, upload.single('imageUri')], asyncMiddleware(async (req, res) => {
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

module.exports = router;
