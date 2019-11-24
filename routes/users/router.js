/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = mongoose.model('Users');

// GET all users
function getUsers(req, callback) {
  Users.find({})
    .then(function (err, found) {
      if (!err) {
        if (found.length != 0) {
          console.log('Users collection retrieved from database.');
          callback(found);
        } else {
          console.log('Empty users collection retrieved from database.');
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

// Creates a new users
router.post('/', function (req, res) {
  if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {
    console.log('Creating new users...')
    if ('firstName' in req.body === undefined && 'lastName' in req.body === undefined && 'birthday' in req.body === undefined && 'sex' in req.body === undefined) {
      res = setResponse('json', 400, res, {Error: "First name, last name, birthday, sex, and phone number must be provided"});
      res.end();
    } else {
      const coach = new Coaches({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        description: req.body.description,
        photo: req.body.photo,
        birthday: req.body.birthday,
        sex: req.body.sex,
        email: req.body.email,
        phone: req.body.phone
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

// Search for and users
router.get('/search', function (req, res) {
  const filter = getFilter(req);
  Users.find({})
    .then((favorites) => {
      let result = favorites.filter((o) => {
        if (filter._id && filter.name) {
          return (filter.name == o.name && filter._id == o._id);
        } else if (filter._id) {
          return (filter._id == o._id);
        } else if (filter.name) {
          return (filter.name == o.name);
        } else if (filter._id && filter.name) {
          return (filter.bookmarked == o.bookmarked);
        } else {
          return false;
        }
      });

      if (result.length > 0) {
        if (req.accepts("html")) {
          res.status(200);
          let myFav = [];
          myFav.push(result[0]);
          res.render("favorites", {favorites: myFav});
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

// Creates filter
function getFilter(req) {
  const filter = {};
  // Search by users ID
  if (req.query._id != undefined && !mongoose.Types.ObjectId.isValid(req.query._id && req.query.firstName === undefined && req.query.lastName === undefined)) {
    filter._id = req.query._id;
    // Search by users ID, first name and last name
  } else if (req.query._id !== undefined && req.query.firstName !== undefined && req.query.lastName !== undefined) {
    filter._id = req.query._id;
    filter.name = req.query.firstName;
    filter.name = req.query.lastName;
    // Search by users ID and last name
  } else if (req.query._id !== undefined && req.query.firstName === undefined && req.query.lastName !== undefined) {
    filter._id = req.query._id;
    filter.name = req.query.lastName;
  } else {
    console.log('You need a valid users ID!');
    throw Error('You need a valid users ID!');
  }
  // Search by sex
  if (req.params.sex !== undefined || req.query.sex !== undefined) {
    filter.sex = req.params.sex;
  } else if (req.query.sex !== undefined) {
    filter.sex = req.query.sex;
  }
  return filter;
}

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
