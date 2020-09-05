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
  getTeamCategory,
  postTeamCategory,
  getTeamCategoryById,
  updateTeamCategoryById,
  deleteTeamCategoryById
} = require('../controllers/team.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getTeamInfo));
router.get('/category', asyncMiddleware(getTeamCategory));

router.post('/', [auth, upload], asyncMiddleware(postTeamInfo));
router.post('/category', [auth], asyncMiddleware(postTeamCategory));

router.get('/:id', validateObjId, asyncMiddleware(getTeamInfoById));
router.get('/category/:id', validateObjId, asyncMiddleware(getTeamCategoryById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateTeamInfo));
router.put('/category/:id', [auth, validateObjId], asyncMiddleware(updateTeamCategoryById));

router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deleteTeamInfo));
router.delete('/category/:id', [auth, admin, validateObjId], asyncMiddleware(deleteTeamCategoryById));



module.exports = router;
