const cloudinary = require('cloudinary');

const { Testimonial, validateTestimonialInfo } = require('../models/testimonial');


exports.getTestimonialList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const testimonialList = await Testimonial.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Testimonial.countDocuments();

    return res.status(200).send({
      testimonialList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Error', err.message);
  }
}

exports.postTestimonialInfo = async (req, res) => {
  let result;
  const { error } = validateTestimonialInfo(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  try {
    result = await cloudinary.v2.uploader.upload(req.file.path);
  } catch (exceptionError) {
    return res.status(400).send({
      error: exceptionError,
      message: 'Error while uploading image please try again later.'
    });
  }

  const testimonial = new Testimonial({
    imageUri: result.secure_url,
    message: req.body.message,
    messageBy: req.body.messageBy,
    designation: req.body.designation,
    organization: req.body.organization
  });
  const savedData = await testimonial.save();
  return res.status(200).send({ message: 'Testimonial has been save successfully. But wont appear on home screen until Admin verified it', result: savedData });
}

exports.deleteTestimonialById = async (req, res) => {
  const testimonial = await Testimonial.findByIdAndRemove(req.params.id);
  if (!testimonial) return res.status(404).send('The testimonial with the given ID was not found.');
  res.status(200).send(testimonial);
}

exports.getTestimonialById = async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return res.status(404).send('The testimonial with the given ID was not found.');
  res.status(200).send(testimonial);
}

exports.updateTestimonialById = async (req, res) => {
  let result;
  const response = await Testimonial.findById(req.params.id);

  if (!response) return res.status(404).send('The testimonial info with the given ID was not found');

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

  const testimonialUpdated = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!testimonialUpdated) return res.status(404).send('The testimonial info with the given ID was not found');
  res.status(200).send(testimonialUpdated);
}

