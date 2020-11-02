const express = require('express');

require('../../../middleware/cloudinary');
const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const upload = require('../../../middleware/multer');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  postQuoteInfo,
  getQuoteInfoById,
  updateQuoteInfoById,
  deleteQuoteInfoById,
  getQuoteListWithAuthToken,
  getQuoteListWithoutAuthToken,
} = require('../controllers/quote.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getQuoteListWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getQuoteListWithAuthToken));

router.post('/', [auth, upload], asyncMiddleware(postQuoteInfo));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getQuoteInfoById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateQuoteInfoById));

router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deleteQuoteInfoById));


module.exports = router;
