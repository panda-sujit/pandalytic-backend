const cloudinary = require('cloudinary');

const covertToSlug = require('../helpers/slugify');
const { NewsFeed, validate } = require('../models/newsFeed');


exports.getNewsFeedList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const newsFeedList = await NewsFeed.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await NewsFeed.countDocuments();

    return res.status(200).send({
      newsFeedList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Error', err.message);
  }
}

exports.postNewsFeed = async (req, res) => {
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

  const newsFeed = new NewsFeed({
    title: req.body.title,
    imageUri: result.secure_url,
    description: req.body.description,
    publishedBy: req.body.publishedBy,
    slug: covertToSlug(req.body.title),
    readMin: req.body.readMin,
    tag: req.body.tag,
  });
  const savedData = await newsFeed.save();
  return res.status(200).send({ message: 'News Feed info has been save successfully. But wont appear on home screen until Admin verified it', result: savedData });
}

exports.deleteNewsFeedById = async (req, res) => {
  const newsFeed = await NewsFeed.findByIdAndRemove(req.params.id);
  if (!newsFeed) return res.status(404).send('The news feed with the given ID was not found.');
  res.status(200).send(newsFeed);
}

exports.getNewsFeedById = async (req, res) => {
  const newsFeed = await NewsFeed.findById(req.params.id);
  if (!newsFeed) return res.status(404).send('The news feed info with the given ID was not found.');
  res.status(200).send(newsFeed);
}

exports.getNewsFeedBySlug = async (req, res) => {
  const newsFeed = await NewsFeed.find({ slug: req.params.slug });
  if (!newsFeed) return res.status(404).send('The news feed info with the given ID was not found.');
  res.status(200).send(newsFeed);
}

exports.updateNewsFeedById = async (req, res) => {
  let result;
  const response = await NewsFeed.findById(req.params.id);

  if (!response) return res.status(404).send('The news feed info with the given ID was not found');

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
  if (req.body.title) {
    req.body['slug'] = covertToSlug(req.body.title);
  }
  req.body['updatedAt'] = Date.now();

  const newsFeedInfoUpdated = await NewsFeed.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!newsFeedInfoUpdated) return res.status(404).send('The news feed info with the given ID was not found');
  res.status(200).send(newsFeedInfoUpdated);
}

