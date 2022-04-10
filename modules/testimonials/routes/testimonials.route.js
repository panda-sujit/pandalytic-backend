const express = require('express');

require('../../../middleware/cloudinary');
const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const upload = require('../../../middleware/multer');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  postTestimonialInfo,
  getTestimonialInfoById,
  deleteTestimonialInfoById,
  updateTestimonialInfoById,
  getTestimonialListWithAuthToken,
  getTestimonialListWithoutAuthToken,
} = require('../controllers/testimonial.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getTestimonialListWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getTestimonialListWithAuthToken));

router.post('/', [auth, upload], asyncMiddleware(postTestimonialInfo));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getTestimonialInfoById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateTestimonialInfoById));

router.delete('/:id', [auth, validateObjId], asyncMiddleware(deleteTestimonialInfoById));


module.exports = router;
