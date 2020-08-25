const express = require('express');

require('../middleware/cloudinary');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/multer');
const asyncMiddleware = require('../middleware/async');
const validateObjId = require('../middleware/validateObjectId');

const {
  postNewsFeed,
  getNewsFeedList,
  getNewsFeedById,
  getNewsFeedBySlug,
  deleteNewsFeedById,
  updateNewsFeedById
} = require('../controllers/newsFeed.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getNewsFeedList));
router.get('/slug/:slug', asyncMiddleware(getNewsFeedBySlug));
router.post('/', [auth, upload], asyncMiddleware(postNewsFeed));
router.get('/:id', validateObjId, asyncMiddleware(getNewsFeedById));
router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateNewsFeedById));
router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deleteNewsFeedById));


module.exports = router;
