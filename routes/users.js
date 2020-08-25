const express = require('express');

const auth = require('../middleware/auth');
const upload = require('../middleware/multer');

const { getUserInfo, registerUserInfo, updateUserInfo } = require('../controllers/user.controller');

const router = express.Router();

router.post('/', registerUserInfo);
router.get('/me', auth, getUserInfo);
router.put('/me', [auth, upload], updateUserInfo);

module.exports = router;
