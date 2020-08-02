const express = require('express');

require('../middleware/cloudinary');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/multer');
const asyncMiddleware = require('../middleware/async');
const validateObjId = require('../middleware/validateObjectId');

const { getTeamInfo, postTeamInfo, deleteTeamInfo, getTeamInfoById, updateTeamInfo } = require('../controllers/team.controller');

const router = express.Router();

router.get('/', asyncMiddleware(getTeamInfo));
router.post('/', [auth, upload], asyncMiddleware(postTeamInfo));
router.get('/:id', validateObjId, asyncMiddleware(getTeamInfoById));
router.put('/:id', [auth, validateObjId, upload], asyncMiddleware(updateTeamInfo));
router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deleteTeamInfo));


module.exports = router;
