const Fawn = require('fawn');
const express = require('express');
const mongoose = require('mongoose');

const auth = require('../middleware/auth');

const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const { Rental, validate } = require('../models/rental');


const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rental = await Rental.find().sort('name');
  res.status(200).send(rental);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // if (!mongoose.Types.ObjectId.isValid(req.body.customerId)) return res.status(400).send('Invalid customer');

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send('The customer with the given Id was not found');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send('The movie with the given Id was not found');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
    },
    dailyRentalRate: req.body.dailyRentalRate
  });

  // rental = await rental.save();
  // rental.numberInStock--;
  // rental.save();
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, {
        $inc: { numberInStock: -1 }
      })
      .run();
    res.status(200).send(rental);
  } catch (ex) {
    res.status(500).send('Something went wrong.');
  }

});

// router.put('/:id', async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const genre = await Rental.findById(req.params.genreId);
//   if (!genre) return res.status(404).send('The genre with the given ID was not found');

//   const movie = await Rental.findByIdAndUpdate(req.params.id, {
//     title: req.body.title,
//     genre: {
//       _id: genre._id,
//       genre: genre.genre
//     },
//     numberInStock: req.body.numberInStock,
//     dailyRentalRate: req.body.dailyRentalRate
//   }, { new: true });

//   if (!movie) return res.status(404).send('The movie with the given ID was not found');
//   res.status(200).send(movie);
// });

// router.delete('/:id', async (req, res) => {
//   const movie = await Rental.findByIdAndRemove(req.params.id);
//   if (!movie) return res.status(404).send('The movie with the given ID was not found');
//   res.status(200).send(movie)
// });


router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send('The rental with the given ID was not found');
  res.status(200).send(rental);
});

module.exports = router;
