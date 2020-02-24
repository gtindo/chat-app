const express = require('express');
const router = express.Router();

const config = require('../config');
const ejabberdApi = require('../apis/ejabberd');

router.get('/', (req, res) => {
  return res.json({
    "app_name": config.APP_NAME, 
    "app_version": config.APP_VERSION
  });
});

router.get('/check-account/:user', async (req, res) => {
  try {
    let user = req.params.user;
    let val = await ejabberdApi.checkAccount(user);
    return res.send(val); 
  } catch (err) {
    //
    console.log(err);
  }
});

module.exports = router;