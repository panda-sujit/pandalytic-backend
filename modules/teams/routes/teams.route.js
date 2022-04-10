const express = require('express');

require('../../../middleware/cloudinary');
const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const upload = require('../../../middleware/multer');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  getTeamListWithAuthToken,
  getTeamListWithoutAuthToken,
  postTeamInfo,
  getTeamInfoById,
  deleteTeamInfoById,
  updateTeamInfoById,
  getTeamCategoryWithAuthToken,
  getTeamCategoryWithoutAuthToken,
  postTeamCategory,
  getTeamCategoryById,
  updateTeamCategoryById,
  deleteTeamCategoryById,
  // deleteTeamCategoryByIdPermanently
} = require('../controllers/team.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getTeamListWithoutAuthToken));
router.get('/category', asyncMiddleware(getTeamCategoryWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getTeamListWithAuthToken));
router.get('/category/all', [auth], asyncMiddleware(getTeamCategoryWithAuthToken));

router.post('/', [auth, upload], asyncMiddleware(postTeamInfo));
router.post('/category', [auth], asyncMiddleware(postTeamCategory));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getTeamInfoById));
router.get('/category/:id', [auth, validateObjId], asyncMiddleware(getTeamCategoryById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateTeamInfoById));
router.put('/category/:id', [auth, validateObjId], asyncMiddleware(updateTeamCategoryById));

router.delete('/:id', [auth, validateObjId], asyncMiddleware(deleteTeamInfoById));
router.delete('/category/:id', [auth, validateObjId], asyncMiddleware(deleteTeamCategoryById));

// router.delete('/category/permanently/:id', [auth, admin, validateObjId], asyncMiddleware(deleteTeamCategoryByIdPermanently));



module.exports = router;
