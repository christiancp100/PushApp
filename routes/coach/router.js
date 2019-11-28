/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('../../models/UserAccount.js');
require('../../models/Credential.js');

let UserAccount = mongoose.model('UserAccount');
let Credentials = mongoose.model('Credentials');

// GET all coach
function getCoaches(req, res) {
    UserAccount.find({})
        .then((coaches) => {
            if (req.accepts('text/html')) {
                res.end();
            } else if (req.accepts('application/json')) {
                res = setResponse('json', 200, res, result);
            } else {
                res.status(400);
            }
            res.end();
        })
        .catch((err) => {
            res.status(500);
            res.end();
        });
}


router.get('/', function (req, res) {
    res.type("html");
    res.render('coach-board');
    /*if (req.header('accept') == "text/html") {

    } else {
        res.status(400).end()
    }*/
})
// Create a new coach
router.post('/new', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {
        console.log('Creating new coach...');
        try {
            let salt = await bcrypt.genSalt(10);
            let code = await bcrypt.hash(req.body.password, salt);
            let credentials = new Credentials({
                username: req.body.username,
                password: code
            });
            let credentialRef = await credentials.save();
            let user = new UserAccount({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                description: req.body.description,
                photo: req.body.photo,
                birthday: req.body.birthday,
                sex: req.body.sex,
                email: req.body.email,
                phone: req.body.phone,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode,
                country: req.body.country,
                currency: req.body.currency,
                localization: req.body.localization,
                accountType: 'coach',
                creationDate: Date.now(),
                _credentials: credentialRef._id
            });
            if (user.description === undefined) {
                user.description = '';
            }
            if (user.photo === undefined) {
                user.photo = '';
            }
            if (user.address2 === undefined) {
                user.address2 = '';
            }
            let savedUser = await user.save();
            if (req.accepts("text/html")) {
                res = setResponse('html', 201, res);
                res.end();
            } else if (req.accepts("application/json")) {
                res = setResponse('json', 201, res, savedUser);
            }
            res.end(savedUser);
        } catch (e) {
            res = setResponse('json', 400, res, {Error: e + ""});
            res.end();
        }
    } else {
        res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
        res.end();
    }
});

// Creates filter for searching coaches on the database
function getFilter(req) {
    let filter = {};
    filter.accountType = 'coach';
    let request;
    if (Object.keys(req.body).length > 0) {
        request = req.body;
    } else if (Object.keys(req.query).length > 0) {
        request = req.query;
    }
    if (request !== undefined) {
        //Filter based on:
        // ID
        if (request.id !== undefined && mongoose.Types.ObjectId.isValid(request.id)) {
            filter._id = request.id;
        }
        // First name
        if (request.firstName !== undefined) {
            filter.firstName = request.firstName;
        }
        // Last name
        if (request.lastName !== undefined) {
            filter.lastName = request.lastName;
        }
        // Birthday
        if (request.birthday !== undefined) {
            filter.birthday = request.birthday;
        }
        // Sex
        if (request.sex !== undefined) {
            filter.sex = request.sex;
        }
        // City
        if (request.city !== undefined) {
            filter.city = request.city;
        }
        // State
        if (request.state !== undefined) {
            filter.state = request.state;
        }
        // Country
        if (request.country !== undefined) {
            filter.country = request.country;
        }
        // Services
        if (request.services !== undefined) {
            filter.services = request.services;
        }
        return filter;
    }
}

// Search for coach
router.get('/search', function (req, res) {
    let filter = getFilter(req);
    console.log(filter);
    UserAccount.find(filter)
        .then((coaches) => {
            if (coaches.length > 0) {
                let length = coaches.length;
                console.log(length + " coaches has been found!");
                console.log(coaches);
                if (req.accepts('html')) {
                    res.status(200);
                } else if (req.accepts('json')) {
                    res = setResponse('json', 200, res, result);
                }
                res.end();
            } else {
                res = setResponse('error', 404, res, result);
                res.end();
            }
        })
        .catch((err) => {
            console.log("0 coaches has been found!");
            res.status(404).end()
        })
});

router.get('/setting', function (req, res) {
    //todo render setting with info from database
    //todo check headers
});

// Edit a coach
// It works only with all the required information provided
router.put('/edit/:id', async (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for coach with ID: ' + req.params.id + '.');
            try {
                let found = await UserAccount.findById(req.params.id);
                if (found != null) {
                    if (req.body.firstName) {
                        found.firstName = req.body.firstName;
                    }
                    if (req.body.lastName) {
                        found.lastName = req.body.lastName;
                    }
                    if (req.body.description) {
                        found.description = req.body.description;
                    }
                    if (req.body.photo) {
                        found.photo = req.body.photo;
                    }
                    if (req.body.birthday) {
                        found.birthday = req.body.birthday;
                    }
                    if (req.body.sex) {
                        found.sex = req.body.sex;
                    }
                    if (req.body.email) {
                        found.email = req.body.email;
                    }
                    if (req.body.phone) {
                        found.phone = req.body.phone;
                    }
                    if (req.body.address1) {
                        found.address1 = req.body.address1;
                    }
                    if (req.body.address2) {
                        found.address2 = req.body.address2;
                    }
                    if (req.body.city) {
                        found.city = req.body.city;
                    }
                    if (req.body.state) {
                        found.state = req.body.state;
                    }
                    if (req.body.zipCode) {
                        found.zipCode = req.body.zipCode;
                    }
                    if (req.body.country) {
                        found.country = req.body.country;
                    }
                    if (req.body.currency) {
                        found.currency = req.body.currency;
                    }
                    if (req.body.localization) {
                        found.localization = req.body.localization;
                    }
                } else {
                    res = setResponse('error', 404, res, {Error: 'Coach not found!'});
                    res.end();
                }
                let saved = await found.save();
                console.log('Coach with ID: ' + req.params.id + ' updated!');
                if (req.accepts("text/html")) {
                    res = setResponse('html', 201, res);
                    res.redirect('/');
                } else if (req.accepts("application/json")) {
                    res = setResponse('json', 201, res, saved);
                    res.end();
                }
            } catch (e) {
                res = setResponse(e, 404, res, {Error: 'Coach not found!'});
            }
        }
    }
});

// Soft delete a coach
// The delete won't remove all the data of an userAccount, simply, it replaces the critical data with default value.
router.put('/delete/:id', async (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for coach with ID: ' + req.params.id + '.');
            try {
                let found = await UserAccount.findById(req.params.id);
                if (found != null) {
                    found.firstName = 'anonymous';
                    found.lastName = ' ';
                    found.description = '';
                    found.photo = '';
                    found.email = ' ';
                    found.phone = 0;
                    found.address1 = ' ';
                    found.address2 = '';
                    console.log('MODIFICATO');
                } else {
                    res = setResponse('error', 404, res, {Error: 'Coach not found!'});
                    res.end();
                }
                console.log(found);
                let saved = found.save()
                    .then((saved) => {
                        console.log(saved);
                        res.end();
                    })
                    .catch(err => console.log(err));
                console.log('Coach with ID: ' + req.params.id + ' was softly deleted!');
                if (req.accepts("text/html")) {
                    res = setResponse('html', 201, res);
                    res.redirect('/');
                } else if (req.accepts("application/json")) {
                    res = setResponse('json', 201, res, saved);
                    res.end();
                }
            } catch (e) {
                res = setResponse(e, 500, res, {Error: 'Coach not found!'});
            }
        }
    }
});

router.post('/auth', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {

        let client = await Credentials.findOne({username: req.body.username});
        console.log(client);
        if (!client) {
            return res.status(400).send('Incorrect username.');
        }
        const validPassword = await bcrypt.compare(req.body.password, client.password);


        if (!validPassword) {
            return res.status(400).send('Incorrect email or password.');
        }

        //const token = jwt.sign({ _id: client._id }, 'PrivateKey');//send what is needed??
        //return res.header('x-auth-token', token).res.send(client); //todo store on the client side
        res.end("DONE");
    }
});

// Customized response
function setResponse(type, code, res, msg) {
    res.status(code);
    switch (type) {
        case 'json':
            res.set('Content-Type', 'application/json');
            res.json(msg);
            return res;
            break;
        case 'html':
            return res.set('Content-Type', 'text/html');
            break;
        case 'error':
            res.json(msg);
            return res;
            break;
        default:
            break;
    }
}

router.post('/username', async (req, res) => {
    if (req.get('Content-Type') === "application/json") {
        console.log(req.body);
        let found = await Credentials.findOne({username: req.body.username})
        if (!found) {
            console.log("TRUE");
            res.send(true);
        } else {
            console.log("FALSE");
            res.send(false);
        }
    } else {
        res.status(500).end("ERROR")
    }
});

router.post('/username', async (req, res) => {
    if (req.get('Content-Type') === "application/json") {
        try {
            let username = await Credentials.find({});
            res.send(username);
        } catch (e) {
            res.status(500).end("ERROR")
        }
    } else {
        res.status(500).end("ERROR")
    }
});

module.exports = router;
