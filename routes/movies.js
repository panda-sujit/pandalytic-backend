const express = require('express');
const auth = require('../middleware/auth');

const { Genre } = require('../models/genre');
const { Movie, validate } = require('../models/movie');

const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.status(200).send(movies);
});

router.post('/', auth, async (req, res) => {
  console.log(req.body, "Request Body")
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genre);
  if (!genre) return res.status(404).send('The genre with the given Id was not found');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      genre: genre.genre
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  await movie.save();
  res.status(200).send(movie);
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.params.genreId);
  if (!genre) return res.status(404).send('The genre with the given ID was not found');

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: {
      _id: genre._id,
      genre: genre.genre
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  }, { new: true });

  if (!movie) return res.status(404).send('The movie with the given ID was not found');
  res.status(200).send(movie);
});

router.delete('/:id', auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send('The movie with the given ID was not found');
  res.status(200).send(movie)
});


router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send('The movie with the given ID was not found');
  res.status(200).send(movie);
});

module.exports = router;
