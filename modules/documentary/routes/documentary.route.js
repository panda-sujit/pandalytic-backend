const express = require('express');

require('../../../middleware/cloudinary');
const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const upload = require('../../../middleware/multer');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  postDocumentary,
  getDocumentaryById,
  getDocumentaryBySlug,
  deleteDocumentaryById,
  updateDocumentaryById,
  getDocumentaryListWithAuthToken,
  getDocumentaryListWithoutAuthToken,
} = require('../controllers/documentary.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getDocumentaryListWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getDocumentaryListWithAuthToken));

router.get('/slug/:slug', asyncMiddleware(getDocumentaryBySlug));

router.post('/', [auth, upload], asyncMiddleware(postDocumentary));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getDocumentaryById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateDocumentaryById));

router.delete('/:id', [auth, validateObjId], asyncMiddleware(deleteDocumentaryById));


module.exports = router;
