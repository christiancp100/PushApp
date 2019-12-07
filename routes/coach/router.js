/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const dust = require('dustjs-helpers');//used for helper function inside dust files
let ObjectId = require('mongodb').ObjectID;

require('../../models/UserAccount.js');
require('../../models/Credential.js');
require('../../models/CoachClients.js');
require('../../models/Rating.js');
require('../../models/Service');

let UserAccount = mongoose.model('UserAccount');
let Credentials = mongoose.model('Credentials');
let CoachClients = mongoose.model('CoachClients');
let Rating = mongoose.model('Rating');
let Service = mongoose.model('Service');

// GET all coach
router.get('/', async (req, res) => {
    try {
        let coaches = await UserAccount.find({});
        let result = await coaches.filter((o) => {
            return (o.isDeleted === false);
        });

        if (req.accepts("text/html")) {
            //render
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

// Create a new coach
router.post('/new', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined)) {
        console.log('Creating new coach...');
        if (req.body.firstName === undefined && req.body.lastName === undefined && req.body.birthday === undefined && req.body.sex === undefined &&
            req.body.email === undefined && req.body.address1 === undefined && req.body.city === undefined && req.body.state === undefined &&
            req.body.zipCode === undefined && req.body.country === undefined && req.body.currency === undefined) {
            res = setResponse('json', 400, res, {Error: "Username, password, first name, last name, birthday, sex, email, address1, city, state, zip code, country, and currency must be provided"});
            res.end();
        } else {
            try {
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
                    isDeleted: false
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
                console.log(savedUser._id);
                if (req.accepts("text/html")) {
                    res.render('register_forms/register-credentials.dust', {accID : (savedUser._id).toString()});
                } else if (req.accepts("application/json")) {
                    res = setResponse('json', 201, res, savedUser);
                }
                res.end(savedUser);
            } catch (e) {
                console.log(e);
                res.status(500).end();
            }
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
    filter.isDeleted = 'false';
    let request;

    if (Object.keys(req.body).length > 0) {
        request = req.body;
    }
    if (Object.keys(req.query).length > 0) {
        request = req.query;
    }
    if (Object.keys(req.params).length > 0) {
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
    console.log("ENTRATO");
    let filter = getFilter(req);
    UserAccount.find(filter)
        .then((coaches) => {
            if (coaches.length > 0) {
                let length = coaches.length;
                console.log(length + " coaches has been found!");
                if (req.accepts('html')) {
                    res = setResponse('json', 200, res, coaches);
                    res.status(200);
                    //render
                } else if (req.accepts('json')) {
                    res = setResponse('json', 200, res, coaches);
                }
                res.end();
            } else {
                res = setResponse('error', 404, res, coaches);
                res.end();
            }
        })
        .catch((err) => {
            console.log("0 coaches has been found!");
            res.status(500).end()
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
                    res.redirect('/' + req.user.username);
                } else if (req.accepts("application/json")) {
                    res = setResponse('json', 201, res, {userAccount: saved});
                    res.end();
                }
            } catch (e) {
                res.status(500).end();
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
                if (found != null && found.accountType === 'coach') {
                    found.firstName = 'anonymous';
                    found.lastName = ' ';
                    found.description = '';
                    found.photo = '';
                    found.email = ' ';
                    found.phone = 0;
                    found.address1 = ' ';
                    found.address2 = '';
                    found.isDeleted = true;
                } else {
                    res = setResponse('error', 404, res, {Error: 'Coach not found!'});
                    res.end();
                }
                let saved = found.save()
                    .then((saved) => {
                        res.end();
                    })
                    .catch(err => console.log(err));
                console.log('Coach with ID: ' + req.params.id + ' was softly deleted!');
                if (req.accepts("text/html")) {
                    res = setResponse('html', 201, res);
                    res.redirect('/');
                } else if (req.accepts("application/json")) {
                    res = setResponse('json', 201, res, {userAccount: saved});
                    res.end();
                }
            } catch (e) {
                res.status(500).end();
            }
        }
    }
});

// GET all the information of a coach and render the setting page so that the coach can modify his data
router.get('/edit', isLoggedIn, async (req, res) => {
    let found = await UserAccount.findById(req.user._userAccountId);
    let accountToModify = {
        firstName: found.firstName,
        lastName: found.lastName,
        birthday: found.birthday,
        sex: found.sex,
        email: found.email,
        phone: found.phone,
        address1: found.address1,
        city: found.city,
        state: found.state,
        zipCode: found.zipCode,
        country: found.country,
        currency: found.currency,
        localization: found.localization
    };
    console.log("OLD", accountToModify);
    if (typeof found.description != "undefined") {
        accountToModify.description = found.description;
    }
    if (typeof found.photo != "undefined") {
        accountToModify.photo = found.photo;
    }
    if (typeof found.address2 != "undefined") {
        accountToModify.address2 = found.address2;
    }
    accountToModify.thisId = found._id;
    console.log("to print", accountToModify);
    if (req.accepts("text/html")) {
        res.render('register_forms/coach-settings.dust', accountToModify);
    }
});

// POST a new coach-client relation
router.post('/hire/new', (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Creating a new relation coach-client: ' + req.params.id + '.');
            let hire = new CoachClients({
                _coachId: req.body._coachId,
                _clientId: req.body._clientId,
            });
            hire.save()
                .then((saved) => {
                    console.log(saved);
                    res = setResponse('html', 201, res);
                    res.end();
                })
                .catch((err) => {
                    res = setResponse(err, 500, res, {Error: 'Cannot create a new hire'});
                    res.end();
                })
        }
    }
});

// GET the clients of a coach
router.get('/hire/coach/:id', (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for coach with ID: ' + req.params.id + '.');
            if (req.params.id) {
                CoachClients.find({_coachId: req.params.id})
                    .then((found) => {
                        console.log(found);
                        console.log('The coach has ' + found.length + ' clients.');
                        res = setResponse('json', 200, res, found);
                        res.end();
                    })
                    .catch((err) => {
                        console.log(err);
                        res = setResponse('json', 500, {Error: err});
                        res.end();
                    })
            } else {
                res = setResponse('json', 404, {Error: 'No clients for the given coach'});
                res.end();
            }
        }
    }
});

// GET the coaches of a client
router.get('/hire/client/:id', (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            console.log('Searching for client with ID: ' + req.params.id + '.');
            if (req.params.id) {
                CoachClients.find({_clientId: req.params.id})
                    .then((found) => {
                        console.log(found);
                        console.log('The client has ' + found.length + ' coaches.');
                        res = setResponse('json', 200, res, found);
                        res.end();
                    })
                    .catch((err) => {
                        console.log(err);
                        res = setResponse('json', 500, {Error: err});
                        res.end();
                    })
            } else {
                res = setResponse('json', 404, {Error: 'No coaches for the given client'});
                res.end();
            }
        }
    }
});

router.delete('/hire/delete/:id', async (req, res) => {
    if (req.accepts("json")) {
        if (req.params.id !== undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            try {
                console.log('Searching for hire-relation with ID: ' + req.params.id + '.');
                let found = await CoachClients.findById(req.params.id);
                if (found === null) {
                    res = setResponse('json', 404, res, {Error: 'No hire-relation for the given id'});
                    res.end();
                } else {
                    try {
                        let removed = await CoachClients.remove(found);
                        console.log('The hire-relation has been deleted!');
                        res = setResponse('json', 200, res, removed);
                        res.end();
                    } catch (e) {
                        res = setResponse('json', 500, res, {Error: e});
                        res.end();
                    }
                }
            } catch (e) {
                res = setResponse('json', 500, res, {Error: e});
                res.end();
            }
        }
    }
});

router.put('/rating', async (req, res) =>{
    let body = await JSON.parse(req.body);
    console.log(body);
    let found = await Rating.findById(ObjectId(body.objId));
    found.title = body.title;
    found.comment = body.comment;
    found.score = body.score;
    await found.save();
    res.end();/*todo whatever needed*/
});

router.post('/ratings', async (req, res) => {
    let media = 0;
    let body = await JSON.parse(req.body);
    let found  = await Rating.find({_coachId : body.id});
    if (!found){
        res.send('0');/*todo whatever needed*/
    }
    for (let i = 0; i < found.length; i++) {
        media += found[i].score;
    }
    media = Math.floor(media/(found.length-1));
    res.send(media.toString());
    //res.render('rating/stars.dust', {media : media}); //send media of rating
})

router.post('/newrating', async (req, res) =>{
    let body = await JSON.parse(req.body);
    console.log("body", body);
    console.log("user", req.user);
    console.log(req.body.id);
    let rate = new Rating({
        _clientId: ObjectId("5de66a9ef671d50d31c8b936"),
        _coachId: ObjectId(body.id),
        score : body.score,
        comment: body.comment,
        title: body.title
    });
    rate.save()
        .then(() => res.status(201).end())//todo rerender the page of client
        .catch(() => res.status(500).end());
});

//GET all the services of a given coach
router.get('/services/:id', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json") || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.get('Accept') === "application/json")) {
        if (req.params.id === undefined && !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res = setResponse('json', 400, res, {Error: "To retrieve services of a coach provide a valid coachId."});
            res.end();
        }
        console.log("Looking for services of the coach with ID " + req.params.id);
        try{
            let serviceFound = await Service.find({_coachId: req.params.id});
            if(serviceFound === null){
                res = setResponse('json', 404, res, {Error: 'No service for the given id'});
                res.end();
            }
            res = setResponse('json', 200, res, serviceFound);
            res.end();
        }catch(e){
            console.log(e);
            res.status(500);
            res.end();
        }
    } else {
        res = setResponse('json', 412, res, {Error: "Precondition Failed (incorrect request header fields)."});
        res.end();
    }
});

//GET all the services
router.get('/services', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json") || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.get('Accept') === "application/json")) {
        console.log("Looking for all the services");
        try{
            let foundServices = await Service.find({});
            res = setResponse('json', 200, res, foundServices);
            res.end();
        }catch(e){
            res.status(500);
            res.end();
        }
    } else {
        res = setResponse('json', 412, res, {Error: "Precondition Failed (incorrect request header fields)."});
        res.end();
    }
});

// POST a new service
router.post('/services/new', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
        console.log('Creating new service...');
        if (req.body._coachId === undefined && !mongoose.Types.ObjectId.isValid(req.params.id) || req.body.name === undefined || req.body.description === undefined || req.body.duration === undefined || req.body.fee === undefined) {
            res = setResponse('json', 400, res, {Error: "To create a new Service provide a valid coachId, a service name, description, duration and fee."});
            res.end()
        } else {
            let service = new Service({
                _coachId: req.body._coachId,
                name: req.body.name,
                description: req.body.description,
                duration: req.body.duration,
                fee: req.body.fee
            });
            try{
                let savedService = await service.save();
                res = setResponse('json', 201, res, savedService);
                res.end();
            }catch(e){
                console.log(e);
                res.status(500);
                res.end();
            }
        }
    } else {
        res = setResponse('json', 412, res, {Error: "Precondition Failed (incorrect request header fields)."});
        res.end();
    }
});

// no fields
// PUT update an existing service
router.put('/services/edit/:id', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
        if (req.params.id === undefined || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res = setResponse('json', 400, res, {Error: "To create a new Service provide a valid serviceId."});
            res.end();
        }
        if(req.body.name === undefined && req.body.fee === undefined && req.body.description === undefined && req.body.duration === undefined){
            res = setResponse('json', 404, res, {Error: 'The field you want to update does not exist in Service'});
            res.end();
        }
        console.log('Editing service...');
        console.log('Searching for service with ID: ' + req.params.id + '.');
        try {
            let found = await Service.findById(req.params.id);
            if (found === null) {
                res = setResponse('json', 404, res, {Error: 'No service for the given id'});
                res.end();
            } else {
                if(req.body.name){
                    found.name = req.body.name;
                }
                if(req.body.description){
                    found.description = req.body.description;
                }
                if(req.body.duration){
                    found.duration = req.body.duration;
                }
                if(req.body.fee){
                    found.fee = req.body.fee;
                }
                let saved = await found.save();
                res = setResponse('json', 200, res, saved);
                res.end();
            }
        } catch(e) {
            console.log(e);
            res.status(500);
            res.end();
        }
    } else {
        res = setResponse('json', 412, res, {Error: "Precondition Failed (incorrect request header fields)."});
        res.end();
    }
});

// DELETE an existing service
router.delete('/services/delete/:id', async (req, res) => {
    if (req.accepts("json")) {
        console.log('ID', req.params.id);
        if (req.params.id === undefined || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).end();
        } else {
            try {
                console.log('Searching for service with ID: ' + req.params.id + '.');
                let found = await Service.findById(req.params.id);
                if (found === null) {
                    res = setResponse('json', 404, res, {Error: 'No service for the given id'});
                    res.end();
                } else {
                    let removed = await Service.remove(found);
                    console.log('The hire-relation has been deleted!');
                    res = setResponse('json', 200, res, removed);
                    res.end();
                }
            } catch (e) {
                res = setResponse('json', 500, res, {Error: e});
                res.end();
            }
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

function isLoggedIn(req, res, next) {
    // redirect if coach isn't not authenticated
    if (!req.user){
        res.redirect('/login');
    }
    // go on if coach is authenticated
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't render login page
    res.redirect('/login');
}

//todo delete this root /username

module.exports = router;
