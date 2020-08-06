const express = require('express');

const { loginUser } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/', loginUser);


module.exports = router;
