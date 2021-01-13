const express = require('express');

const router = express.Router();

// Handle the Root request
router.all('/', (req, res) => {
  res.send('Root has no operation. Request successfull.');
});

module.exports = router;
