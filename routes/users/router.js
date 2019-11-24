/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Users = mongoose.model('Users');

// GET all
router.get('/', function (req, res) {
  Users.find()
    .then((users) => {
      if (req.accepts("text/html")) {
        // let usersModel = {
        //   favorites: users,
        //   title: "My Canvas"
        // };
        // res.render("users", usersModel);
        res.end();
      } else if (req.accepts("application/json")) {
        res = setResponse('json', 200, res, users);
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
        height: req.body.height,
        weight: req.body.weight,
        bmi: req.body.bmi,
        unitSystem: req.body.unitSystem || 'metric',
        contactInfo: {
          email: req.body.contactInfo.email,
          phone: req.body.contactInfo.email,
          address1: req.body.contactInfo.phone,
          address2: req.body.contactInfo.phone,
          city: req.body.contactInfo.phone,
          state: req.body.contactInfo.phone,
          zipCode: req.body.contactInfo.phone,
          country: req.body.contactInfo.phone,
        },
        currency: req.body.localization,
        localization: req.body.localization || "en-US",
        creationDate: Date.now()
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

// // GET by ID
// router.get('/:id', function (req, res) {
//   if (mongoose.Types.ObjectId.isValid(req.params.id)) {
//     if (req.accepts("json")) {
//       Users.findById({_id: req.params.id})
//         .then((user) => {
//           console.log('Looking for user with ID: ' + req.params.id);
//           if (user != null) {
//             res = setResponse('json', 200, res, user);
//           } else {
//             //not found
//             res = setResponse('error', 404, res, {Error: "Not found!"});
//           }
//           res.end();
//         })
//         .catch((err) => {
//           res = setResponse('error', 500, res, err.message);
//           res.end();
//         });
//     } else {
//       //not acceptable
//       res.status(406);
//       res.json({Error: "Request not acceptable"});
//       res.end();
//     }
//   } else {
//     res = setResponse('error', 404, res, {Error: "Invalid ID!"});
//     res.end();
//   }
// });

// Search for and users
router.get('/search', function (req, res) {
  const filter = getFilter(req);
  Users.find({})
    .then((users) => {
      console.log("filter: " + filter._id);
      let result = users.filter((o) => {
        if (filter._id) {
          console.log("object:  " + o._id + " | " + filter._id);
          return (filter._id == o._id);
        }
        if (filter._id && filter.firstName && filter.lastName) {
          return (filter._id == o._id);
        }
        if (filter._id && !filter.firstName && !filter.lastName) {
          return (filter._id == o._id && filter.firstName == o.firstName && filter.lastName == o.lastName);
        }
        if (filter.firstName && filter.lastName) {
          return (filter.firstName == o.firstName && filter.lastName == o.lastName);
        }
        if (filter.firstName) {
          return (filter.firstName == o.firstName);
        }
        if (filter.lastName) {
          return (filter.lastName == o.lastName);
        }
        if (filter.sex && filter.sex) {
          return (filter.sex == o.sex);
        }
        if (filter.country && filter.country) {
          return (filter.country == o.contactInfo.country);
        } else {
          return false;
        }
      });

      if (result.length > 0) {
        if (req.accepts("html")) {
          res.status(200);
          //xx
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

// Creates filter
function getFilter(req) {
  const filter = {};
  let request;

  if (req.body !== undefined) {
    request = req.body;
  } else if (req.query !== undefined) {
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
    return filter;
  }
}

// // Creates filter
// function getFilter(req) {
//   const filter = {};
//
//   // Filter by query parameters
//   if (req.query !== undefined) {
//     // Filter by user ID
//     if (req.query.id !== undefined && mongoose.Types.ObjectId.isValid(req.query.id)) {
//       filter._id = req.query.id;
//     }
//
//     // Filter by user's last name
//     if (req.query.lastName !== undefined) {
//       filter.lastName = req.query.lastName;
//     }
//
//     // Filter by user's first name
//     if (req.query.firstName !== undefined) {
//       filter.firstName = req.query.firstName;
//     }
//
//     // Search by country
//     if (req.query.country !== undefined) {
//       filter.country = req.query.country;
//     }
//     // Search by sex
//     if (req.query.sex !== undefined) {
//       filter.sex = req.query.sex;
//     }
//   }
//
//   // Filter by body parameters
//   else if (req.body !== undefined) {
//     // Filter by user ID only
//     if (req.body.id !== undefined && mongoose.Types.ObjectId.isValid(req.body.id)) {
//       filter._id = req.body.id;
//     }
//
//     // Filter by user's last name
//     if (req.body.lastName !== undefined) {
//       filter.lastName = req.body.lastName;
//     }
//
//     // Filter by user's first name
//     if (req.body.firstName !== undefined) {
//       filter.firstName = req.body.firstName;
//     }
//
//     // Search by country
//     if (req.body.country !== undefined) {
//       filter.country = req.body.country;
//     }
//     // Search by sex
//     if (req.body.sex !== undefined) {
//       filter.sex = req.body.sex;
//     }
//   }
//   return filter;
// }

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
