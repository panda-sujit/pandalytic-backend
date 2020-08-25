const express = require('express');

require('../middleware/cloudinary');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateObjId = require('../middleware/validateObjectId');

const {
  postPricing,
  getPricingList,
  getPricingById,
  deletePricingById,
  updatePricingById
} = require('../controllers/pricing.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getPricingList));
router.post('/', auth, asyncMiddleware(postPricing));
router.get('/:id', validateObjId, asyncMiddleware(getPricingById));
router.put('/:id', [auth, validateObjId], asyncMiddleware(updatePricingById));
router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deletePricingById));


module.exports = router;
