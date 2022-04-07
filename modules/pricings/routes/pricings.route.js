const express = require('express');

const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  postPricingInfo,
  getPricingInfoById,
  deletePricingInfoById,
  updatePricingInfoById,
  getPricingListWithAuthToken,
  getPricingListWithoutAuthToken,
} = require('../controllers/pricing.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getPricingListWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getPricingListWithAuthToken));

router.post('/', [auth], asyncMiddleware(postPricingInfo));

router.get('/:id', [validateObjId], asyncMiddleware(getPricingInfoById));

router.put('/:id', [auth, validateObjId], asyncMiddleware(updatePricingInfoById));

router.delete('/:id', [auth, validateObjId], asyncMiddleware(deletePricingInfoById));


module.exports = router;
