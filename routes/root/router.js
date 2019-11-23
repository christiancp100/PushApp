/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  if (req.accepts("html")) {
    // Code here

  } else {
    res.status(500);
    res.end();
  }
});

/** router for /root */
module.exports = router;
