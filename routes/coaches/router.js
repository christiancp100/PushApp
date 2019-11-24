/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Coaches = mongoose.model('Coaches');

// GET all coaches
function getUsers(req, callback) {
    Coaches.find({})
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
        console.log("Error:  " + err.message);
      });
  }

// Create a new users
router.post('/', function (req, res) {
  if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {
    console.log('Creating new coaches...')
    if ('firstName' in req.body === undefined && 'lastName' in req.body === undefined && 'birthday' in req.body === undefined && 'sex' in req.body === undefined) {
      res = setResponse('json', 400, res, {Error: "First name, last name, birthday, sex, and phone number must be provided"});
      res.end();
    } else {
      const user = new Users({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        description: req.body.description,
        photo: req.body.photo,
        birthday: req.body.birthday,
        sex: req.body.sex,
        email: req.body.email,
        phone: req.body.phone,
        certificate: [Certificate],
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        country: req.body.country,
      });
  
      user.save().then((saved) => {
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

// Create search filter
function getFilter(req) {
  const filter = {};
  // Search by coaches ID
  if (req.query._id != undefined && !mongoose.Types.ObjectId.isValid(req.query._id && req.query.firstName === undefined && req.query.lastName === undefined)) {
    filter._id = req.query._id;
    // Search by coaches ID, first name and last name
  } else if (req.query._id !== undefined && req.query.firstName !== undefined && req.query.lastName !== undefined) {
    filter._id = req.query._id;
    filter.name = req.query.firstName;
    filter.name = req.query.lastName;
    // Search by coaches ID and last name
  } else if (req.query._id !== undefined && req.query.firstName === undefined && req.query.lastName !== undefined) {
    filter._id = req.query._id;
    filter.name = req.query.lastName;
  } else {
    console.log('You need a valid users ID!');
    throw Error('You need a valid users ID!');
  }
  // Search by coaches sex
  if (req.params.sex !== undefined || req.query.sex !== undefined) {
    filter.sex = req.params.sex;
  } else if (req.query.sex !== undefined) {
    filter.sex = req.query.sex;
  }
  // Search by coaches city
  if (req.params.city !== undefined || req.query.city !== undefined) {
    filter.city = req.params.city;
  } else if (req.query.city !== undefined) {
    filter.city = req.query.city;
  }
  //to discuss - search by city, ...?
  return filter;
}

// Search for coaches
router.get('/search', function (req, res) {

});

function setResponse(type, code, res, msg) {

}

module.exports = router;