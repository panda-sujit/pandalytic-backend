const express = require('express');

const auth = require('../../../middleware/auth');
const asyncMiddleware = require('../../../middleware/async');
const validateObjId = require('../../../middleware/validateObjectId');

const {
  getContactUsQueries,
  postContactUsQueries,
  getContactUsQueriesById
} = require('../controllers/contactus.controller');

const router = express.Router();

router.post('/', asyncMiddleware(postContactUsQueries));

router.get('/', [auth], asyncMiddleware(getContactUsQueries));

router.get('/:id', [auth, validateObjId], asyncMiddleware(getContactUsQueriesById));


module.exports = router;
