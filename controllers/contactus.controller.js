const cloudinary = require('cloudinary');

const { ContactUs, validateContactUs } = require('../models/contactus');


exports.getContactUsQueries = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const contactUsQueriesList = await ContactUs.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await ContactUs.countDocuments();

    return res.status(200).send({
      contactUsQueriesList,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    console.error(err.message);
    return res.status(400).send('Error', err.message);
  }
}

exports.postContactUsQueries = async (req, res) => {
  const { error } = validateContactUs(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const queries = new ContactUs(req.body);

  await queries.save();
  return res.status(200).send('Queries has been save successfully.');
}

exports.getContactUsQueriesById = async (req, res) => {
  const query = await ContactUs.findById(req.params.id);
  if (!query) return res.status(404).send('The query with the given ID was not found.');
  res.status(200).send(query);
}

// exports.updateTeamInfo = async (req, res) => {
//   let result;
//   const response = await Team.findById(req.params.id);

//   if (!response) return res.status(404).send('The team info with the given ID was not found');

//   if (req.file) {
//     try {
//       result = await cloudinary.v2.uploader.upload(req.file.path);
//       req.body['imageUri'] = result.secure_url;
//     } catch (exceptionError) {
//       return res.status(400).send({
//         error: exceptionError,
//         message: 'Error while uploading image please try again later.'
//       });
//     }
//   }
//   req.body['updatedAt'] = Date.now();

//   const teamInfoUpdated = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });

//   if (!teamInfoUpdated) return res.status(404).send('The team info with the given ID was not found');
//   res.status(200).send(teamInfoUpdated);
// }

