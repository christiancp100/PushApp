/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  if (req.accepts("html")) {
    res.render('index', {title: 'PushApp'});
  } else {
    res.status(500);
    res.end();
  }
});

/** router for /root */
module.exports = router;
