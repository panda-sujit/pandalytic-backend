const cloudinary = require('cloudinary');

const covertToSlug = require('../helpers/slugify');
const {
  Blog,
  validate
} = require('../models/blog');


exports.getBlogList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const blogList = await Blog.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Blog.countDocuments();

    return res.status(200).send({
      blogList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Error', err.message);
  }
}

exports.postBlog = async (req, res) => {
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

  const blog = new Blog({
    title: req.body.title,
    imageUri: result.secure_url,
    description: req.body.description,
    publishedBy: req.body.publishedBy,
    slug: covertToSlug(req.body.title),
    readMin: req.body.readMin,
    tag: req.body.tag,
  });
  const savedData = await blog.save();
  return res.status(200).send({ message: 'Blog info has been save successfully.', result: savedData });
}

exports.deleteBlogById = async (req, res) => {
  const blog = await Blog.findByIdAndRemove(req.params.id);
  if (!blog) return res.status(404).send({ message: 'The blog with the given ID was not found.' });
  res.status(200).send({ message: 'Data is deleted successfully.', result: blog });
}

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).send('The blog info with the given ID was not found.');
  res.status(200).send(blog);
}

exports.getBlogBySlug = async (req, res) => {
  const blog = await Blog.find({ slug: req.params.slug });
  if (!blog) return res.status(404).send('The blog info with the given ID was not found.');
  res.status(200).send(blog);
}

exports.updateBlogById = async (req, res) => {
  let result;
  const response = await Blog.findById(req.params.id);

  if (!response) return res.status(404).send('The blog info with the given ID was not found.');

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

  const blogInfoUpdated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!blogInfoUpdated) return res.status(404).send('The blog info with the given ID was not found.');
  res.status(200).send({ message: 'The blog with the given ID is updated successfully.', result: blogInfoUpdated });
}

