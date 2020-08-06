const { Career, validateCareer } = require('../models/career');


exports.getCareerList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const careerList = await Career.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Career.countDocuments();

    return res.status(200).send({
      careerList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Error', err.message);
  }
}

exports.postCareer = async (req, res) => {
  const { error } = validateCareer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const career = new Career(req.body);

  await career.save();
  return res.status(200).send('Career has been save successfully.');
}

exports.getCareerById = async (req, res) => {
  const career = await Career.findById(req.params.id);
  if (!career) return res.status(404).send('The career with the given ID was not found.');
  res.status(200).send(career);
}

exports.deleteCareerById = async (req, res) => {
  const career = await Career.findByIdAndRemove(req.params.id);
  if (!career) return res.status(404).send('The career info with the given ID was not found.');
  res.status(200).send(career);
}

exports.updateCareerById = async (req, res) => {
  req.body['updatedAt'] = Date.now();
  const careerUpdated = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!careerUpdated) return res.status(404).send('The career info with the given ID was not found');
  res.status(200).send(careerUpdated);
}

