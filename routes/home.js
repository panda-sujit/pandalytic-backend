const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to Pandalytic CMS API')
});

module.exports = router;
