// /** @module root/router */
// 'use strict';
//
// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Users = mongoose.model('Users');
//
// /* GET users listing. */
// function getUsers(req, callback) {
//   Users.find({})
//     .then(function (err, found) {
//       if (!err) {
//         if (found.length != 0) {
//           console.log('Users collection retrieved from database.');
//           callback(found);
//         } else {
//           console.log('Empty user collection retrieved from database.');
//           callback(found);
//         }
//       } else {
//         throw err;
//       }
//     })
//     .catch((err) => {
//       console.log("Error:  " + err.message);
//     });
// }
//
// // Creates filter
// function getFilter(req) {
//   const filter = {};
// if (req.query._id != undefined && req.query.bookmark != undefined) {
//     filter._id = req.query._id;
//     filter.name = req.query.bookmark;
//   }
//   if (req.params._id !== undefined && !mongoose.Types.ObjectId.isValid(req.params._id)) {
//     console.log('You need a valid user ID!');
//     throw new Error('You need a valid user ID!');
//   } else {
//     if (req.query._id !== undefined && req.query.firstName !== undefined&& req.query.lastName !== undefined) {
//       filter._id = req.query._id;
//       filter.name = req.query.firstName;
//       filter.name = req.query.lastName;
//     } else if (req.query._id != undefined) {
//       filter._id = req.query._id;
//     }
//   }
//   if (req.query.name != undefined) {
//     filter.name = req.query.name;
//   }
//   return filter;
// }
//
// function setResponse(type, code, res, msg) {
//   res.status(code);
//   switch (type) {
//     case 'json':
//       res.set('Content-Type', 'application/json');
//       res.json(msg);
//       return res;
//       break;
//     case 'html':
//       return res.set('Content-Type', 'text/html');
//       break;
//     case 'error':
//       res.json(msg);
//       return res;
//       break;
//     default:
//       break;
//   }
// }
//
//
// module.exports = router;
