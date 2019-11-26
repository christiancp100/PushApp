/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../models/UserAccount.js');
require('../../models/Credential.js');
require('../../models/Coach.js');

let UserAccount = mongoose.model('UserAccount');
let Coach = mongoose.model('Coach');
let Credentials = mongoose.model('Credentials');

// GET all coach
function getCoaches(req, res) {
    Coach.find({})
        .then((clients) => {
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
router.post('/', function (req, res) {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {
        console.log('Creating new coach...');
        if ('firstName' in req.body.userAccount === undefined || 'lastName' in req.body.userAccount === undefined || 'birthday' in req.body.userAccount === undefined ||
            'sex' in req.body.userAccount === undefined || 'email' in req.body.userAccount === undefined || 'phone' in req.body.userAccount === undefined ||
            'address1' in req.body.userAccount === undefined || 'city' in req.body.userAccount === undefined || 'state' in req.body.userAccount === undefined ||
            'zipCode' in req.body.userAccount === undefined || 'country' in req.body.userAccount === undefined) {
            res = setResponse('json', 400, res, {Error: "First name, last name, birthday, sex, email address, phone number, at least one address, city, state, zip code and country must be provided"});
            res.end();
        } else {
            let credentials = new Credentials({
                username: req.body.userAccount.credentials.username,
                password: req.body.userAccount.credentials.password
            });

            let userAccount = new UserAccount({
                firstName: req.body.userAccount.firstName,
                lastName: req.body.userAccount.lastName,
                description: req.body.userAccount.description,
                photo: req.body.userAccount.photo,
                birthday: req.body.userAccount.birthday,
                sex: req.body.userAccount.sex,
                email: req.body.userAccount.email,
                phone: req.body.userAccount.phone,
                address1: req.body.userAccount.address1,
                address2: req.body.userAccount.address2,
                city: req.body.userAccount.city,
                state: req.body.userAccount.state,
                zipCode: req.body.userAccount.zipCode,
                country: req.body.userAccount.country,
                currency: req.body.userAccount.currency,
                localization: req.body.userAccount.localization,
                creationDate: Date.now(),
                credentials: credentials
            });

            let coach = new Coach({
                userAccount: userAccount,
                // certificates: ,
                // service: ,
            });

            coach.save().then((saved) => {
                if (req.accepts("text/html")) {
                    res = setResponse('html', 201, res);
                    res.redirect('/');
                } else if (req.accepts("application/json")) {
                    res = setResponse('json', 201, res, saved);
                }
                res.end();
            })
                .catch((err) => {
                    res.status(500).end();
                });
        }
    } else {
        res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
        res.end();
    }
});

// const newCoach = new Coach({
//     userAccount: {
//         firstName: 'Alfa',
//         lastName: 'Beta',
//         description: 'gamma',
//         birthday: '19.07.1999',
//         sex: 'male',
//         email: 'jacopo.caratti@usi.ch',
//         phone: '0799610450',
//         address1: 'Via Nizzola 4',
//         city: 'Bellinzona',
//         state: 'Ticino',
//         country: 'Switzerland',
//     },
// });
// newCoach.save().then((saved) => {(console.log(saved + ' just saved in the database'))});

// Creates filter for searching coaches on the database
function getFilter(req) {
    let filter = {};
    const userAccount = {};
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
            filter = {'_id':request.id};
        }
        // First name
        if (request.firstName !== undefined) {
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
router.put('/edit/:id', function (req, res) {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for coach with ID: ' + req.params.id + '.');
            Coach.findById({_id: req.params.id})
                .then((found) => {
                        if (found != null) {
                            found.userAccount.firstName = req.body.firstName;
                            found.userAccount.lastName = req.body.lastName;
                            found.userAccount.description = req.body.description;
                            found.userAccount.photo = req.body.photo;
                            found.userAccount.birthday = req.body.birthday;
                            found.userAccount.sex = req.body.sex;
                            found.userAccount.email = req.body.email;
                            found.userAccount.phone = req.body.phone;
                            found.userAccount.address1 = req.body.address1;
                            found.userAccount.address2 = req.body.address2;
                            found.userAccount.city = req.body.city;
                            found.userAccount.state = req.body.state;
                            found.userAccount.country = req.body.country;
                            found.userAccount.currency = req.body.currency;
                            found.userAccount.localization = req.body.localization;
                            found.userAccount.certificates = req.body.certificates;
                            found.userAccount.services = req.body.services;
                            return found.save()
                        }
                    },
                    (err) => {
                        res = setResponse('error', 404, res, {Error: 'Favorite not found!'});
                    })
                .then((saved) => {
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
                    res.status(500);
                    res.end();
                });
        }
    }
});

// Soft delete a coach
router.delete('/delete/:id', function (req, res) {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for user with ID: ' + req.params.id + '.');
            Coach.findById({_id: req.params.id})
                .then((found) => {
                        if (found != null) {
                            found.isDeleted = true;
                            return found.save()
                        }
                    },
                    (err) => {
                        res = setResponse('error', 404, res, {Error: 'Coach not found!'});
                    })
                .then((saved) => {
                    console.log('Coach with ID: ' + req.params.id + ' was soft deleted!');
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
                    res.status(500);
                    res.end();
                });
        }
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

module.exports = router;