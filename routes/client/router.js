/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let ObjectId = require('mongodb').ObjectID;

require('../../models/UserAccount.js');
require('../../models/Credential.js');
require('../../models/ClientInfo.js');

let UserAccount = mongoose.model('UserAccount');
let ClientInfo = mongoose.model('ClientInfo');
let Credentials = mongoose.model('Credentials');

// GET all
router.get('/test', isLoggedIn, function (req, res) {
    console.log(req.user);
    res.end();
})
router.get('/', async (req, res) => {
    try {
        let clients = await UserAccount.find({});
        let result = await clients.filter((o) => {
            return (o.isDeleted === false);
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
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end();
    }
});

// Creates a new client
router.post('/new', async (req, res) => {
    try {
        if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined)) {
            console.log('Creating new users...');

            if (req.body.firstName === undefined &&
                req.body.lastName === undefined &&
                req.body.birthday === undefined &&
                req.body.sex === undefined &&
                req.body.email === undefined &&
                req.body.address1 === undefined &&
                req.body.city === undefined &&
                req.body.state === undefined &&
                req.body.zipCode === undefined &&
                req.body.country === undefined &&
                req.body.currency === undefined &&
                req.body.username === undefined &&
                req.body.password === undefined) {
                res = setResponse('json', 400, res, {Error: "Username, password, first name, last name, birthday, sex, email, address1, city, state, zip code, country, and currency must be provided"});
                res.end();
            } else {
                let userAccount = new UserAccount({
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
                    accountType: 'client',
                    creationDate: Date.now()
                });

                if (req.body.description === undefined) {
                    userAccount.description = '';
                }
                if (req.body.photo === undefined) {
                    userAccount.photo = '';
                }
                if (req.body.address2 === undefined) {
                    userAccount.address2 = '';
                }

                let savedUserAccount = await userAccount.save();

                let clientInfo = new ClientInfo({
                    _clientId: savedUserAccount._id,
                    height: req.body.height,
                    weight: req.body.weight,
                    unitSystem: req.body.unitSystem
                });

                if (req.body.height === undefined) {
                    clientInfo.height = '';
                }
                if (req.body.weight === undefined) {
                    clientInfo.height = '';
                }

                let savedClientInfo = await clientInfo.save();

                if (req.accepts("text/html")) {
                    res.render('register_forms/register-credentials.dust', {accID : (savedUserAccount._id).toString()});//todo pass ID ad argument
                } else if (req.accepts("application/json")) {
                    savedUserAccount._credentials = 'private';
                    res = setResponse('json', 201, res, {
                        userAccount: savedUserAccount,
                        clientInfo: savedClientInfo
                    });
                }
                res.end();
            }
        } else {
            res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
            res.end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

// Search for and users
router.get('/search', function (req, res) {
    const filter = getFilter(req);
    UserAccount.find({})
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
                if (filter.isDeleted) {
                    return (filter.isDeleted === o.isDeleted);
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
});

// Edit an user
router.put('/edit/:id', async (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            try {
                console.log('Searching for user with ID: ' + req.params.id + '.');
                let foundClient = await UserAccount.findById({_id: req.params.id});
                if (foundClient !== null) {
                    foundClient.firstName = req.body.firstName;
                    foundClient.lastName = req.body.lastName;
                    foundClient.description = req.body.description;
                    foundClient.photo = req.body.photo;
                    foundClient.birthday = req.body.birthday;
                    foundClient.sex = req.body.sex;
                    foundClient.email = req.body.email;
                    foundClient.phone = req.body.phone;
                    foundClient.address1 = req.body.address1;
                    foundClient.address2 = req.body.address2;
                    foundClient.city = req.body.city;
                    foundClient.state = req.body.state;
                    foundClient.zipCode = req.body.zipCode;
                    foundClient.country = req.body.country;
                    foundClient.currency = req.body.currency;
                    foundClient.localization = req.body.localization;

                    let savedClient = await foundClient.save();
                    let foundClientInfo = await ClientInfo.findOne({_clientId: req.params.id});

                    foundClientInfo.height = req.body.height;
                    foundClientInfo.weight = req.body.weight;
                    foundClientInfo.unitSystem = req.body.unitSystem;

                    let savedClientInfo = await foundClientInfo.save();

                    console.log('User with ID: ' + req.params.id + ' updated!');
                    if (req.accepts("text/html")) {
                        res = setResponse('html', 201, res);
                    } else if (req.accepts("application/json")) {
                        // delete savedClient._doc['_credentials'];
                        res = setResponse('json', 201, res, {
                            userAccount: savedClient,
                            clientInfo: savedClientInfo
                        });
                        res.end();
                    }
                } else {
                    res = setResponse('error', 404, res, {Error: 'Client not found!'});
                }
            } catch
                (err) {
                console.log(err);
                res.status(500);
                res.end();
            }
        }
    }
});


// Wipes client's userAccount and info without deleting the objects.
router.delete('/delete/:id', async (req, res) => {
    try {
        if (req.accepts("json")) {
            console.log('Searching for user with ID: ' + req.params.id + '.');
            let foundClient = await UserAccount.findById({_id: req.params.id});
            if (foundClient !== null && foundClient.accountType === 'client') {
                foundClient.firstName = 'anonymous';
                foundClient.lastName = ' ';
                foundClient.description = '';
                foundClient.photo = '';
                foundClient.email = ' ';
                foundClient.phone = ' ';
                foundClient.address1 = ' ';
                foundClient.address2 = '';
                foundClient.isDeleted = true;

                let foundCredential = await Credentials.findOne({_userAccountId: req.params.id});
                await foundClient.save();

                if (foundCredential !== undefined) {
                    await foundCredential.remove();
                }
                console.log('Client with ID ' + req.params.id + ' was successfully deleted!');
                if (req.accepts("text/html")) {
                    res = setResponse('html', 200, res);
                } else if (req.accepts("application/json")) {
                    res = setResponse('json', 200, res, {Result: `Client with ID ` + foundClient._id.toString() + ` was successfully deleted!`});
                    res.end();
                }
            } else {
                res = setResponse('error', 404, res, {Error: 'Client not found!'});
            }
        } else {
            res = setResponse('error', 400, res);
        }
    } catch
        (err) {
        console.log(err);
        res.status(500);
        res.end();
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
    } else if (Object.keys(req.params).length > 0) {
        request = req.params;
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
        if (request._clientId !== undefined) {
            filter._clientId = request._clientId;
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
        case 'html':
            return res.set('Content-Type', 'text/html');
        case 'error':
            res.json(msg);
            return res;
        default:
            break;
    }
}

function isLoggedIn(req, res, next) {
    console.log(req.path);
    if (!req.user){
        res.redirect('/login');
    }
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
        return next();}
    // if they aren't render login page
    res.redirect('/login');
}

router.post('/login', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {

        let client = await Client.findOne({'access.username': req.body.username});
        console.log(client);
        if (!client) {
            return res.status(400).send('Incorrect username!');
        }
        const validPassword = await bcrypt.compare(req.body.password, client.access.password);

        if (!validPassword) {
            return res.status(400).send('Incorrect password!');
        }
        //encode the _id of user object in the mongo
        const token = jwt.sign({_id: client._id}, config.get('PrivateKey'));
        return res.header('x-auth-token', token).redirect('/client'); //todo store on the client side
    }
});

module.exports = router;
