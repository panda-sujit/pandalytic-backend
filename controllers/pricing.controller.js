const { Pricing, validate } = require('../models/pricing');


exports.getPricingList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const pricingList = await Pricing.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Pricing.countDocuments();

    return res.status(200).send({
      pricingList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Error', err.message);
  }
}

exports.postPricing = async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const pricing = new Pricing({
    pricingCategory: req.body.pricingCategory,
    pricingRatePerMonth: req.body.pricingRatePerMonth,
    pricingRatePerYear: req.body.pricingRatePerYear,
    features: req.body.features,
  });
  const savedData = await pricing.save();
  return res.status(200).send({ message: 'Pricing info has been save successfully.', result: savedData });
}

exports.deletePricingById = async (req, res) => {
  const pricing = await Pricing.findByIdAndRemove(req.params.id);
  if (!pricing) return res.status(404).send('The pricing with the given ID was not found.');
  res.status(200).send({ message: 'Data is deleted successfully.', result: pricing });
}

exports.getPricingById = async (req, res) => {
  const pricing = await Pricing.findById(req.params.id);
  if (!pricing) return res.status(404).send('The pricing info with the given ID was not found.');
  res.status(200).send(pricing);
}

exports.updatePricingById = async (req, res) => {
  req.body['updatedAt'] = Date.now();
  const pricingInfoUpdated = await Pricing.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!pricingInfoUpdated) return res.status(404).send('The pricing info with the given ID was not found.');
  res.status(200).send({ message: 'The pricing info with the given ID is updated successfully.', result: pricingInfoUpdated });
}

