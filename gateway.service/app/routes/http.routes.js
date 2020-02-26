const express = require('express');
const router = express.Router();

const config = require('../config');

router.get('/', (req, res) => {
  return res.json({
    "app_name": config.APP_NAME, 
    "app_version": config.APP_VERSION
  });
});


module.exports = router;
