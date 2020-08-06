const express = require('express');

require('../middleware/cloudinary');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/multer');
const asyncMiddleware = require('../middleware/async');
const validateObjId = require('../middleware/validateObjectId');

const { getTestimonialList, postTestimonialInfo, getTestimonialById, deleteTestimonialById, updateTestimonialById } = require('../controllers/testimonial.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getTestimonialList));
router.post('/', [auth, upload], asyncMiddleware(postTestimonialInfo));
router.get('/:id', validateObjId, asyncMiddleware(getTestimonialById));
router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateTestimonialById));
router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deleteTestimonialById));


module.exports = router;
