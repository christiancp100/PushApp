/** @module root/router */
'use strict';

const config = require('config');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('../../models/UserAccount');
require('../../models/Credential');
require('../../models/Client');

let Client = mongoose.model('Client');
let UserAccount = mongoose.model('UserAccount');
let Credentials = mongoose.model('Credentials');

const bcrypt = require('bcrypt');

// GET all
router.get('/', function (req, res) {
    req.body.isDeleted = false;
    const filter = getFilter(req);
    Client.find({})
        .then((clients) => {
            let result = clients.filter((o) => {
                if (!filter.isDeleted) {
                    return (filter.isDeleted === o.isDeleted);
                } else {
                    return false;
                }
            });
            if (req.accepts("text/html")) {
                // let usersModel = {
                //   users: users,
                //   title: "My Canvas"
                // };
                // res.render("result", usersModel);
                res.end();
            } else if (req.accepts("application/json")) {
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
});

// Creates a new users
router.post('/new', async function (req, res) {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined)) {
        console.log('Creating new users...');

        if (req.body.userAccount.firstName === undefined &&
            req.body.userAccount.lastName === undefined &&
            req.body.userAccount.birthday === undefined &&
            req.body.userAccount.sex === undefined &&
            req.body.userAccount.email === undefined &&
            req.body.userAccount.address1 === undefined &&
            req.body.userAccount.city === undefined &&
            req.body.userAccount.state === undefined &&
            req.body.userAccount.zipCode === undefined &&
            req.body.userAccount.country === undefined &&
            req.body.userAccount.currency === undefined &&
            req.body.credentials.username === undefined &&
            req.body.credentials.password === undefined) {
            res = setResponse('json', 400, res, {Error: "Username, password, first name, last name, birthday, sex, email, address1, city, state, zip code, country, and currency must be provided"});
            res.end();
        } else {
            try {
                let hashedPassword = await bcrypt.hash(req.body.credentials.password, await bcrypt.genSalt(10));

                let credentials = new Credentials({
                    username: req.body.credentials.username,
                    password: hashedPassword
                });

                let savedCredentials = await credentials.save();

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
                    accountType: req.body.userAccount.accountType,
                    creationDate: Date.now(),
                    credentials: savedCredentials._id
                });

                let savedUserAccount_id = await userAccount.save();

                let client = new client({
                    userAccount: savedUserAccount_id,
                    height: req.body.client.height,
                    weight: req.body.client.weight,
                    bmi: req.body.client.height / req.body.client.weight,
                    unitSystem: req.body.client.unitSystem
                });

                let saved = await client.save();

                if (req.accepts("text/html")) {
                    res.redirect('/auth');
                } else if (req.accepts("application/json")) {
                    res = setResponse('json', 201, res, saved);
                }
                res.end();
            } catch (err) {
                console.log(err);
                res.status(500).end();
            }
        }
    } else {
        res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
        res.end();
    }
});

// Search for and users
router.get('/search', function (req, res) {
    const filter = getFilter(req);
    Client.find({})
        .then((clients) => {
            let result = clients.filter((o) => {
                if (filter._id) {
                    return (filter._id.toLowerCase() === o._id.toLowerCase());
                }
                if (filter.firstName) {
                    return (filter.firstName.toLowerCase() === o.firstName.toLowerCase());
                }
                if (filter.lastName) {
                    return (filter.lastName.toLowerCase() === o.lastName.toLowerCase());
                }
                if (filter.sex) {
                    return (filter.sex.toLowerCase() === o.sex.toLowerCase());
                }
                if (filter.country) {
                    return (filter.country.toLowerCase() === o.country.toLowerCase());
                }
            });

            if (result.length > 0) {
                if (req.accepts("html")) {
                    res.status(200);
                    let myFav = [];
                    // let usersModel = {
                    //   favorites: users,
                    //   title: "My Canvas"
                    // };
                    // res.render("users", usersModel);

                    // myFav.push(result[0]);
                    // res.render("favorites", {favorites: myFav});
                } else if (req.accepts("json")) {
                    res = setResponse('json', 200, res, result);
                }
                res.end();
            } else {
                res = setResponse('error', 404, res, result);
                res.end();
            }
        })
        .catch((err) => {
            res.status(500);
            res.end();
        });
})
;

// Edit an user
router.put('/edit/:id', function (req, res) {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for user with ID: ' + req.params.id + '.');
            Client.findById({_id: req.params.id})
                .then((found) => {
                        if (found != null) {
                            // found.firstName = req.body.firstName;
                            // found.lastName = req.body.lastName;
                            found.description = req.body.description;
                            found.photo = req.body.photo;
                            found.birthday = req.body.birthday;
                            found.sex = req.body.sex;
                            found.height = req.body.height;
                            found.weight = req.body.weight;
                            found.bmi = req.body.bmi;
                            found.unitSystem = req.body.unitSystem;
                            found.email = req.body.email;
                            found.phone = req.body.phone;
                            found.address1 = req.body.address1;
                            found.address2 = req.body.address2;
                            found.city = req.body.city;
                            found.state = req.body.state;
                            found.zipCode = req.body.zipCode;
                            found.country = req.body.country;
                            found.currency = req.body.currency;
                            found.localization = req.body.localization;
                            // found.authenticationProvider = req.body.authenticationProvider;
                            return found.save()
                        }
                    },
                    (err) => {
                        res = setResponse('error', 404, res, {Error: 'Favorite not found!'});
                    })
                .then((saved) => {
                    console.log('User with ID: ' + req.params.id + ' updated!');
                    if (req.accepts("text/html")) {
                        res = setResponse('html', 201, res);
                        res.redirect('/');
                    } else if (req.accepts("application/json")) {
                        res = setResponse('json', 201, res, saved);
                        res.end();
                    }
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500);
                    res.end();
                });
        }
    }
});

// Soft delete an user
router.delete('/delete/:id', function (req, res) {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for user with ID: ' + req.params.id + '.');
            Client.findById({_id: req.params.id})
                .then((found) => {
                        if (found != null) {
                            found.isDeleted = true;
                            return found.save()
                        }
                    },
                    (err) => {
                        res = setResponse('error', 404, res, {Error: 'Favorite not found!'});
                    })
                .then((saved) => {
                    console.log('User with ID: ' + req.params.id + ' was soft deleted!');
                    if (req.accepts("text/html")) {
                        res = setResponse('html', 201, res);
                        res.redirect('/');
                    } else if (req.accepts("application/json")) {
                        res = setResponse('json', 201, res, saved);
                        res.end();
                    }
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500);
                    res.end();
                });
        }
    }
});

// Creates filter for searching users on the database
function getFilter(req) {
    const filter = {};
    let request;

    if (Object.keys(req.body).length > 0) {
        request = req.body;
    } else if (Object.keys(req.query).length > 0) {
        request = req.query;
    }

    if (request !== undefined) {
        // Filter by user ID
        if (request.id !== undefined && mongoose.Types.ObjectId.isValid(request.id)) {
            filter._id = request.id;
        }

        // Filter by user's last name
        if (request.lastName !== undefined) {
            filter.lastName = request.lastName;
        }

        // Filter by user's first name
        if (request.firstName !== undefined) {
            filter.firstName = request.firstName;
        }

        // Search by country
        if (request.country !== undefined) {
            filter.country = request.country;
        }
        // Search by sex
        if (request.sex !== undefined) {
            filter.sex = request.sex;
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

// Creates custom responses
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

router.post('/auth', async (req, res) => {
    //todo check the request

    let client = await Client.findOne({'access.username': req.body.username});
    console.log(client);
    if (!client) {
        return res.status(400).send('Incorrect username.');
    }
    const validPassword = await bcrypt.compare(req.body.password, client.access.password);


    if (!validPassword) {
        return res.status(400).send('Incorrect email or password.');
    }

    const token = jwt.sign({_id: client._id}, config.get('PrivateKey'));//send what is needed??
    return res.header('x-auth-token', token).res.send(client); //todo store on the client side
})

module.exports = router;
