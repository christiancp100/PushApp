/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('../../models/UserAccount.js');
require('../../models/Credential.js');

let UserAccount = mongoose.model('UserAccount');

router.post('/auth', async (req, res) => {
    // Code here
});


module.exports = router;
