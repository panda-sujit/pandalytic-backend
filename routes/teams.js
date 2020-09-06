const express = require('express');

require('../middleware/cloudinary');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/multer');
const asyncMiddleware = require('../middleware/async');
const validateObjId = require('../middleware/validateObjectId');

const {
  getTeamInfo,
  postTeamInfo,
  deleteTeamInfo,
  updateTeamInfo,
  getTeamInfoById,
  getTeamCategoryWithAuthToken,
  getTeamCategoryWithoutAuthToken,
  postTeamCategory,
  getTeamCategoryById,
  updateTeamCategoryById,
  deleteTeamCategoryById,
  deleteTeamCategoryByIdPermanently
} = require('../controllers/team.controller');

const router = express.Router();

// router.get('/', asyncMiddleware(getTeamInfo));
router.get('/category', asyncMiddleware(getTeamCategoryWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getTeamInfo));
router.get('/category/all', [auth], asyncMiddleware(getTeamCategoryWithAuthToken));

router.post('/', [auth, upload], asyncMiddleware(postTeamInfo));
router.post('/category', [auth], asyncMiddleware(postTeamCategory));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getTeamInfoById));
router.get('/category/:id', [auth, validateObjId], asyncMiddleware(getTeamCategoryById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateTeamInfo));
router.put('/category/:id', [auth, validateObjId], asyncMiddleware(updateTeamCategoryById));

router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deleteTeamInfo));
router.delete('/category/:id', [auth, admin, validateObjId], asyncMiddleware(deleteTeamCategoryById));

router.delete('/category/permanently/:id', [auth, admin, validateObjId], asyncMiddleware(deleteTeamCategoryByIdPermanently));



module.exports = router;
