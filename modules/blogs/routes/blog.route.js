const express = require('express');

require('../../../middleware/cloudinary');
const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const upload = require('../../../middleware/multer');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  postBlog,
  getBlogById,
  getBlogBySlug,
  deleteBlogById,
  updateBlogById,
  getBlogListWithAuthToken,
  getBlogListWithoutAuthToken,
} = require('../controllers/blog.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getBlogListWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getBlogListWithAuthToken));

router.get('/slug/:slug', asyncMiddleware(getBlogBySlug));

router.post('/', [auth, upload], asyncMiddleware(postBlog));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getBlogById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateBlogById));

router.delete('/:id', [auth, validateObjId], asyncMiddleware(deleteBlogById));


module.exports = router;
