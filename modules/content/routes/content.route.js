const express = require('express');

require('../../../middleware/cloudinary');
const auth = require('../../../middleware/auth');
const upload = require('../../../middleware/multer');
const admin = require('../../../middleware/admin');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  postContentInfo,
  getContentInfoById,
  updateContentInfoById,
  deleteContentInfoById,
  getContentListWithAuthToken,
  getContentListWithoutAuthToken,
  getContentBySlug,
} = require('../controllers/content.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getContentListWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getContentListWithAuthToken));

// router.post('/', (req, res, next) => {
//   console.log("i am here")
//   return res.send({data: 'heelo'})
// })

router.post('/', [auth, upload], asyncMiddleware(postContentInfo));

// router.post('/', [auth, upload], asyncMiddleware(postContentInfo));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getContentInfoById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateContentInfoById));

router.delete('/:id', [auth, validateObjId], asyncMiddleware(deleteContentInfoById));

router.get('/slug/:slug', asyncMiddleware(getContentBySlug));


module.exports = router;
