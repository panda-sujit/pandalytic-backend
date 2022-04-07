const express = require('express');

require('../../../middleware/cloudinary');
const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const upload = require('../../../middleware/multer');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  postProjectInfo,
  getProjectInfoById,
  updateProjectInfoById,
  deleteProjectInfoById,
  getProjectListWithAuthToken,
  getProjectListWithoutAuthToken,
} = require('../controllers/project.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getProjectListWithoutAuthToken));

router.get('/all', [auth], asyncMiddleware(getProjectListWithAuthToken));

router.post('/', [auth, upload], asyncMiddleware(postProjectInfo));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getProjectInfoById));

router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateProjectInfoById));

router.delete('/:id', [auth, validateObjId], asyncMiddleware(deleteProjectInfoById));


module.exports = router;
