const express = require('express');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateObjId = require('../middleware/validateObjectId');

const { Genre, validate } = require('../models/genre');

const router = express.Router();

router.get('/', asyncMiddleware(async (req, res) => {
  // throw new Error('Could not get the genres. Internal Server Error.');
  const genres = await Genre.find().sort('name');
  res.status(200).send(genres);
}));

router.post('/', auth, asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = new Genre({
    genre: req.body.genre
  });
  await genre.save();
  res.status(200).send(genre);
}));

router.put('/:id', [auth, validateObjId], asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findByIdAndUpdate(req.params.id, { genre: req.body.genre }, {
    new: true
  });
  if (!genre) return res.status(404).send('The genre with the given ID was not found');
  res.status(200).send(genre);
}));

router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found');
  res.status(200).send(genre)
}));

router.get('/:id', validateObjId, asyncMiddleware(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found');
  res.status(200).send(genre);
}));

module.exports = router;
