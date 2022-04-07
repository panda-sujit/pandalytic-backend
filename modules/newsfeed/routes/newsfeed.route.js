const express = require('express');

require('../../../middleware/cloudinary');
const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const upload = require('../../../middleware/multer');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  postNewsFeed,
  getNewsFeedById,
  getNewsFeedBySlug,
  deleteNewsFeedById,
  updateNewsFeedById,
  getNewsFeedListWithAuthToken,
  getNewsFeedListWithoutAuthToken,
} = require('../controllers/newsfeed.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getNewsFeedListWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getNewsFeedListWithAuthToken));

router.get('/slug/:slug', asyncMiddleware(getNewsFeedBySlug));

router.post('/', [auth, upload], asyncMiddleware(postNewsFeed));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getNewsFeedById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateNewsFeedById));

router.delete('/:id', [auth, validateObjId], asyncMiddleware(deleteNewsFeedById));


module.exports = router;
