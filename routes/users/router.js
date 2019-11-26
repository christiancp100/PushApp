/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = mongoose.model('Users');

// GET all
router.get('/', function (req, res) {
  req.body.isDeleted = false;
  const filter = getFilter(req);
  Users.find({})
    .then((users) => {
      let result = users.filter((o) => {
        if (!filter.isDeleted) {
          return (filter.isDeleted === o.isDeleted);
        } else {
          return false;
        }
      });
      if (req.accepts("text/html")) {
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
router.post('/new', function (req, res) {
  if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined)) {
    console.log('Creating new users...')
    if ('firstName' in req.body === undefined && 'lastName' in req.body === undefined && 'birthday' in req.body === undefined && 'sex' in req.body === undefined) {
      res = setResponse('json', 400, res, {Error: "First name, last name, birthday, and sex must be provided"});
      res.end();
    } else {
      const user = new Users({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        description: req.body.description,
        photo: req.body.photo,
        birthday: req.body.birthday,
        sex: req.body.sex,
        height: req.body.height,
        weight: req.body.weight,
        bmi: req.body.bmi,
        unitSystem: req.body.unitSystem,
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
        authenticationProvider: req.body.authenticationProvider
      });

      user.save()
        .then((saved) => {
          if (req.accepts("text/html")) {
            // res = setResponse('html', 201, res);
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
    .then((users) => {
      let result = users.filter((o) => {
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
      Users.findById({_id: req.params.id})
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
      Users.findById({_id: req.params.id})
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

module.exports = router;
