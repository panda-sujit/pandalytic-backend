const express = require('express');

const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  postCareerInfo,
  getCareerInfoById,
  updateCareerInfoById,
  deleteCareerInfoById,
  getCareerListWithAuthToken,
  getCareerListWithoutAuthToken,
  getCareerBySlug
} = require('../controllers/career.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getCareerListWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getCareerListWithAuthToken));

router.get('/:slug', asyncMiddleware(getCareerBySlug));

router.post('/', [auth], asyncMiddleware(postCareerInfo));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getCareerInfoById));

router.put('/:id', [auth, validateObjId], asyncMiddleware(updateCareerInfoById));

router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deleteCareerInfoById));


module.exports = router;
