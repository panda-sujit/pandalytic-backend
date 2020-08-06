const express = require('express');

require('../middleware/cloudinary');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/multer');
const asyncMiddleware = require('../middleware/async');
const validateObjId = require('../middleware/validateObjectId');

const { getProjectList, postProjectInfo, deleteProjectById, getProjectById, updateProjectById } = require('../controllers/project.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getProjectList));
router.post('/', [auth, upload], asyncMiddleware(postProjectInfo));
router.get('/:id', validateObjId, asyncMiddleware(getProjectById));
router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateProjectById));
router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deleteProjectById));


module.exports = router;
