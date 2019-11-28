/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('../../models/UserAccount.js');
require('../../models/Credential.js');
require('../../models/ClientInfo.js');

let UserAccount = mongoose.model('UserAccount');
let ClientInfo = mongoose.model('ClientInfo');
let Credentials = mongoose.model('Credentials');

// GET all
router.get('/', async (req, res) => {
    try {
        // req.body.isDeleted = false;
        req.body.firstName = "Anonymous";
        const filter = getFilter(req);
        let clients = await UserAccount.find({});

        let result = await clients.filter((o) => {
            return (filter.firstName !== o.firstName);
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

// Creates a new users
router.post('/new', async (req, res) => {
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
            res = setResponse('json', 400, res, { Error: "Username, password, first name, last name, birthday, sex, email, address1, city, state, zip code, country, and currency must be provided" });
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
                    accountType: 'client',
                    creationDate: Date.now(),
                    _credentials: savedCredentials._id
                });

                let savedUserAccount = await userAccount.save();

                let clientInfo = new ClientInfo({
                    _clientId: savedUserAccount._id,
                    height: req.body.clientInfo.height,
                    weight: req.body.clientInfo.weight,
                    unitSystem: req.body.clientInfo.unitSystem
                });

                let savedClientInfo = await clientInfo.save();

                if (req.accepts("text/html")) {
                    res.redirect('/auth');
                } else if (req.accepts("application/json")) {
                    savedUserAccount._credentials = 'private';
                    res = setResponse('json', 201, res, { userAccount: savedUserAccount, clientInfo: savedClientInfo });
                }
                res.end();
            } catch
            (err) {
                console.log(err);
                res.status(500).end();
            }
        }
    } else {
        res = setResponse('json', 400, res, { Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed." });
        res.end();
    }
});

// Search for and users
router.get('/search', function (req, res) {
    const filter = getFilter(req);
    ClientInfo.find({})
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
router.put('/edit/:id', async (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            try {
                console.log('Searching for user with ID: ' + req.params.id + '.');
                let foundClient = await UserAccount.findById({ _id: req.params.id });
                if (foundClient !== null) {
                    foundClient.firstName = req.body.userAccount.firstName;
                    foundClient.lastName = req.body.userAccount.lastName;
                    foundClient.description = req.body.userAccount.description;
                    foundClient.photo = req.body.userAccount.photo;
                    foundClient.birthday = req.body.userAccount.birthday;
                    foundClient.sex = req.body.userAccount.sex;
                    foundClient.email = req.body.userAccount.email;
                    foundClient.phone = req.body.userAccount.phone;
                    foundClient.address1 = req.body.userAccount.address1;
                    foundClient.address2 = req.body.userAccount.address2;
                    foundClient.city = req.body.userAccount.city;
                    foundClient.state = req.body.userAccount.state;
                    foundClient.zipCode = req.body.userAccount.zipCode;
                    foundClient.country = req.body.userAccount.country;
                    foundClient.currency = req.body.userAccount.currency;
                    foundClient.localization = req.body.userAccount.localization;
                    let savedClient = await foundClient.save();

                    // req.body._clientId = req.params.id
                    // const filter = getFilter(req);

                    // var ObjectId = require('mongoose').Types.ObjectId;
                    let foundClientInfos = await ClientInfo.find({});
                    // foundClientInfo.populate('_clientId');
                    // console.log()
                    // ClientInfo.find({})
                    //     .populate('_clientId')
                    //     .then((found) => console.log(JSON.stringify(found)));

                    let foundClientInfo = foundClientInfos.filter((o) => {
                        // if (id1 && filter._clientId) {
                        console.log(savedClient._id.toString() + ' saved');
                        console.log(o._id.toString() + ' o');
                        console.log(savedClient._id.toString() === o._clientId.toString());
                        console.log('');

                        return (savedClient._id.toString() === o._clientId.toString());
                        // } else {
                        //                         //     return false;
                        //                         // }
                    });
                    console.log('');
                    foundClientInfo[0].height = req.body.clientInfo.height;
                    foundClientInfo[0].weight = req.body.clientInfo.weight;
                    foundClientInfo[0].unitSystem = req.body.clientInfo.unitSystem;

                    let savedClientInfo = await foundClientInfo[0].save();

                    console.log('User with ID: ' + req.params.id + ' updated!');
                    if (req.accepts("text/html")) {
                        res = setResponse('html', 201, res);
                        res.redirect('/');
                    } else if (req.accepts("application/json")) {
                        delete savedClient._doc['_credentials'];
                        res = setResponse('json', 201, res, {
                            userAccount: savedClient,
                            clientInfo: savedClientInfo
                        });
                        res.end();
                    }
                } else {
                    res = setResponse('error', 404, res, { Error: 'Favorite not found!' });
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


// Soft delete an user
router.delete('/delete/:id', function (req, res) {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for user with ID: ' + req.params.id + '.');
            ClientInfo.findById({ _id: req.params.id })
                .then((found) => {
                    if (found != null) {
                        found.isDeleted = true;
                        return found.save()
                    }
                },
                    (err) => {
                        res = setResponse('error', 404, res, { Error: 'Favorite not found!' });
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
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {

        let client = await Client.findOne({ 'access.username': req.body.username });
        console.log(client);
        if (!client) {
            return res.status(400).send('Incorrect username.');
        }
        const validPassword = await bcrypt.compare(req.body.password, client.access.password);


        if (!validPassword) {
            return res.status(400).send('Incorrect email or password.');
        }
        //encode the _id of user object in the mongo
        const token = jwt.sign({ _id: client._id }, config.get('PrivateKey'));
        return res.header('x-auth-token', token).redirect('/client'); //todo store on the client side
    }
})

module.exports = router;
