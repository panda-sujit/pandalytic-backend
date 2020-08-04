const express = require('express');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
const validateObjId = require('../middleware/validateObjectId');

const { getCareerList, postCareer, getCareerById, updateCareerById, deleteCareerById } = require('../controllers/career.controller');

const router = express.Router();

router.post('/', asyncMiddleware(getCareerList));
router.get('/', auth, asyncMiddleware(postCareer));
router.get('/:id', [validateObjId], asyncMiddleware(getCareerById));
router.put('/:id', [auth, validateObjId], asyncMiddleware(updateCareerById));
router.delete('/:id', [auth, admin, validateObjId], asyncMiddleware(deleteCareerById));


module.exports = router;
