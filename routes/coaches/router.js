/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coaches = mongoose.model('Coaches');


module.exports = router;