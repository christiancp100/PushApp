/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coach = require('../../models/Coach');

// GET all coach
function getCoaches(req, callback) {
    Coach.find({})
        .then(function (err, found) {
            if (!err) {
                if (found.length != 0) {
                    console.log('Coaches collection retrieved from database.');
                    callback(found);
                } else {
                    console.log('Empty coaches collection retrieved from database.');
                    callback(found);
                }
            } else {
                throw err;
            }
        })
        .catch((err) => {
            console.log("Error: " + err.message);
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
            const coach = new Coach({
                userAccount: {
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
                    country: req.body.country,
                    currency: req.body.currency,
                    localization: req.body.localization,
                },
                certificates: req.body.certificates,
                services: req.body.services,
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

// Creates filter for searching coaches on the database
function getFilter(req) {
    const filter = {};
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

        // Certificates
        if (request.certificates !== undefined) {
            filter.certificates = request.certificates;
        }

        // Services
        if (request.services !== undefined) {
            filter.services = request.services;
        }

        // Search non deleted
        if (request.isDeleted === undefined) {
            filter.isDeleted = false;
        } else {
            filter.isDeleted = request.isDeleted;
        }
        return filter;
    }
}

// Search for coach
router.get('/search', function (req, res) {

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