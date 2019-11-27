/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('../../models/UserAccount.js');
require('../../models/Credential.js');
require('../../models/Coach.js');

let UserAccount = mongoose.model('UserAccount');
let Coach = mongoose.model('Coach');
let Credentials = mongoose.model('Credentials');

// GET all coach
function getCoaches(req, res) {
    Coach.find({})
        .then((coaches) => {
            if (req.accepts('text/html')) {
                res.end();
            } else if (req.accepts('application/json')){
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

// Create a new coach
router.post('/', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {
        console.log('Creating new coach...');
        if (req.body.firstName === "undefined" && req.body.lastName === "undefined" && req.body.lastName === "undefined" && req.body.lastName === "undefined" &&
            req.body.lastName === "undefined" && req.body.lastName === "undefined" && req.body.lastName === "undefined" && req.body.lastName === "undefined" &&
            req.body.lastName === "undefined" && req.body.lastName === "undefined" && req.body.lastName === "undefined" && req.body.lastName === "undefined" &&
            req.body.username === "undefined" && req.body.password === "undefined"){
            res = setResponse('json', 400, res, {Error: "First name, last name, birthday, sex, email address, phone number, at least one address, city, state, zip code and country must be provided"});
            res.end();
        } else {
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
                creationDate: Date.now(),
                _credentials: credentialRef._id
            });
            let userAccountRef = await user.save();
            let coach = new Coach({
                _userAccount: userAccountRef._id,
                // service:
            });
            let coachSaved = await coach.save();
            if (req.accepts("text/html")) {
                res = setResponse('html', 201, res);
                res.redirect('/');
            } else if (req.accepts("application/json")) {
                res = setResponse('json', 201, res, coachSaved);
            }
            res.end(coachSaved);
        }
    } else {
        res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
        res.end();
    }
});

// Creates filter for searching coaches on the database
function getFilter(req) {
    let filter = {};
    let request;
    if (Object.keys(req.body).length > 0) {
        request = req.body;
    } else if (Object.keys(req.query).length > 0) {
        request = req.query;
    }

    if (request !== undefined) {
        //Filter based on:
        // ID-
        if (request.id !== undefined && mongoose.Types.ObjectId.isValid(request.id)) {
            filter = {'_id':request.id};
        }
        // First name
        if (request.firstName !== undefined) {
            filter = {data: 'userAccount', field: lastName};
            filter = {'userAccount.firstName':request.firstName};
        }
        // Last name
        if (request.lastName !== undefined) {
            filter = {'userAccount.lastName':request.lastName};
        }
        // Birthday
        if (request.birthday !== undefined) {
            filter = {'userAccount.birthday':request.birthday};
        }
        // Sex
        if (request.sex !== undefined) {
            filter = {'userAccount.sex':request.sex};
        }
        // City
        if (request.city !== undefined) {
            filter = {'userAccount.city':request.city};
        }
        // State
        if (request.state !== undefined) {
            filter = {'userAccount.state':request.state};
        }
        // Country
        if (request.country !== undefined) {
            filter = {'userAccount.country':request.country};
        }
        // Certificates
        if (request.certificates !== undefined) {
            filter = {'certificates':request.certificates};
        }
        // Services
        if (request.services !== undefined) {
            filter = {'services':request.services};
        }
        // filter.userAccount = userAccount;
        return filter;
    }
}

// Search for coach
router.get('/search', function (req, res) {
    const filter = getFilter(req);
    Coach.find(filter)
        .then((coaches) => {
            let result = coaches.filter((o) => {
                if (filter._id) {
                    return (filter._id.toLowerCase() === o._id.toLowerCase());
                }
                if (filter.firstName) {
                    return (filter.firstName.toLowerCase() === o.firstName.toLowerCase());
                }
                if (filter.lastName) {
                    return (filter.lastName.toLowerCase() === o.lastName.toLowerCase());
                }
                if (filter.birthday) {
                    return (filter.birthday.toLowerCase() === o.birthday.toLowerCase());
                }
                if (filter.sex) {
                    return (filter.sex.toLowerCase() === o.sex.toLowerCase());
                }
                if (filter.city) {
                    return (filter.city.toLowerCase() === o.city.toLowerCase());
                }
                if (filter.state) {
                    return (filter.state.toLowerCase() === o.state.toLowerCase());
                }
                if (filter.country) {
                    return (filter.country.toLowerCase() === o.country.toLowerCase());
                }
                if (filter.certificates) {
                    return (filter.certificates.toLowerCase() === o.certificates.toLowerCase());
                }
                if (filter.services) {
                    return (filter.services.toLowerCase() === o.services.toLowerCase());
                }
            });
            if (coaches.length > 0) {
                if (req.accepts('html')) {
                    // res.render("coaches", coaches);
                    res.status(200);
                    console.log("coaches has been found!");
                } else if (req.accepts('json')) {
                    res = setResponse('json', 200, res, result);
                }
                res.end();
            } else {
                res = setResponse('error', 404, res, result);
                res.end();
            }})
        .catch((err) => {
            res.status(500).end();
        });
});


// Edit a coach
router.put('/edit/:id', async (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for coach with ID: ' + req.params.id + '.');
            let currentCoach = await Coach.findById(req.params.id);
            if (currentCoach === undefined) {
                res = setResponse('error', 404, res, {Error: 'Coach not found!'});
                res.end();
            }
            let userAccountRef = currentCoach._userAccount;
            if (req.body.firstName || req.body.lastName || req.body.description || req.body.photo || req.body.birthday || req.body.sex || req.body.email || req.body.phone ||
                req.body.address1 || req.body.address2 || req.body.city || req.body.state || req.body.zipCode || req.body.country || req.body.currency || req.body.localization) {
                UserAccount.findById(userAccountRef)
                    .then((found) => {
                        if (found != null) {
                            if (req.body.firstName) {
                                found.firstName = req.body.firstName;
                            } else if (req.body.lastName) {
                                found.lastName = req.body.lastName;
                            } else if (req.body.description) {
                                found.description = req.body.description
                            } else if (req.body.photo) {
                                found.photo = req.body.photo
                            } else if (req.body.birthday) {
                                found.brithday = req.body.birthday
                            } else if (req.body.sex) {
                                found.sex = req.body.sex
                            } else if (req.body.email) {
                                found.email = req.body.email
                            } else if (req.body.phone) {
                                found.phone = req.body.phone
                            } else if (req.body.address1) {
                                found.address1 = req.body.address1;
                            } else if (req.body.address1) {
                                found.address2 = req.body.address2;
                            } else if (req.body.city) {
                                found.city = req.body.city;
                            } else if (req.body.state) {
                                found.state = req.body.state;
                            } else if (req.body.zipCode) {
                                found.zipCode = req.body.zipCode;
                            } else if (req.body.country) {
                                found.country = req.body.country;
                            } else if (req.body.currency) {
                                found.currency = req.body.currency;
                            } else if (req.body.localization) {
                                found.localization = req.body.localization;
                            }
                            return found.save()
                                .then((updated) => {
                                    console.log('Coach with ID: ' + req.params.id + ' updated!');
                                    if (req.accepts("text/html")) {
                                        res = setResponse('html', 201, res);
                                        res.redirect('/');
                                    } else if (req.accepts("application/json")) {
                                        res = setResponse('json', 201, res, saved);
                                        res.end();
                                    }
                                })
                                .catch((err) => {
                                    res.status(500).end();
                                });
                        }
                    })
                    .catch((err) => {
                        res = setResponse('error', 404, res, {Error: 'userAccount related to this coach not found!'});
                        res.end();
                    })
            } else if (req.body.username || req.body.password) {
                let currentUserAccount = await UserAccount.findById(userAccountRef);
                let credentialRef = currentUserAccount._credentials;
                Credentials.findById(credentialRef)
                    .then((found) => {
                        if (found != null) {
                            if (req.body.username) {
                                found.username = req.body.username;
                            } else if (req.body.password) {
                                found.password = req.body.password;
                            }
                        }
                        return found.save()
                            .then((updated) => {
                                console.log('Coach with ID: ' + req.params.id + ' updated!');
                                if (req.accepts("text/html")) {
                                    res = setResponse('html', 201, res);
                                    res.redirect('/');
                                } else if (req.accepts("application/json")) {
                                    res = setResponse('json', 201, res, saved);
                                    res.end();
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).end();
                            });
                    })
                    .catch((err) => {
                        res = setResponse('error', 404, res, {Error: 'Coach not found!'});
                        res.end();
                    })
            } else {
                res = setResponse('error', 404, res, {Error: 'userAccount related to this coach not found!'});
                res.end();
            }
        }
    }
});

// Soft delete a coach
// The delete won't remove all the data of an userAccount, simply, it replaces the critical data with default value.
router.delete('/delete/:id', async (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for user with ID: ' + req.params.id + '.');
            let currentCoach = await Coach.findById(req.params.id);
            if (currentCoach === undefined) {
                res = setResponse('error', 404, res, {Error: 'Coach not found!'});
                res.end();
            }
            let userAccountRef = currentCoach._userAccount;
            UserAccount.findById(userAccountRef)
                .then((found) => {
                        if (found != null) {
                            found.firstName = 'anonymous';
                            found.lastName = 'anonymous';
                            found.description = '';
                            found.photo = '';
                            found.email = 'deletedAccount@gmail.com';
                            found.phone = '0796666666';
                            found.address1 = 'Somewhere else';
                            found.address2 = '';
                        }
                        return found.save()
                    })
                .then((saved) => {
                    console.log('Coach with ID: ' + req.params.id + ' was softly deleted!');
                    if (req.accepts("text/html")) {
                        res = setResponse('html', 201, res);
                        res.redirect('/');
                    } else if (req.accepts("application/json")) {
                        res = setResponse('json', 201, res, saved);
                        res.end();
                    }
                })
                .catch((err) => {
                    res = setResponse('error', 500, res, {Error: 'Internal server error'});
                    res.end();
                })
        }
    }
});

router.post('/auth', async (req, res) => {
    //todo check the request

    let client = await Credentials.findOne({username : req.body.username});
    console.log(client);
    if (!client){
        return res.status(400).send('Incorrect username.');
    }
    const validPassword = await bcrypt.compare(req.body.password, client.password);


    if (!validPassword) {
        return res.status(400).send('Incorrect email or password.');
    }

    //const token = jwt.sign({ _id: client._id }, 'PrivateKey');//send what is needed??
    //return res.header('x-auth-token', token).res.send(client); //todo store on the client side
    res.end("DONE");
})

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

module.exports = router;