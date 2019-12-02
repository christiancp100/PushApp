/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('../../models/Credential.js');
require('../../models/UserAccount.js');

let Credentials = mongoose.model('Credentials');
let UserAccount = mongoose.model('UserAccount');

router.get('/', function (req, res, next) {
  if (req.accepts("html")) {
    res.render('index', {title: 'PushApp'});
  } else {
    res.status(500);
    res.end();
  }
});

router.get('/register', function (req, res) {
  if (req.accepts("html")) {
    res.render('register_forms/register_1');
  } else {
    res.status(500);
    res.end();
  }
})


router.get('/register-coach', (req, res, next) => {
  res.render('register_forms/coach-register');
})

router.get('/register-client', (req, res, next) => {
  res.render('register_forms/client-register');
})

router.get('/coach/dashboard', (req, res) => {
  let menu = {
    items: [
      {name: "Dashboard", icon: "web"},
      {name: "Clients", icon: "list"},
      {name: "Schedules", icon: "dashboard"},
      {name: "Chat", icon: "chat"},
    ],
    accordions: [
      {
        title: "Accounting",
        icon: "chevron_left",
        subItems: [
          {name: "Revenue", icon: "show_chart"},
          {name: "Users", icon: "equalizer"},
          {name: "Conversion Rate", icon: "multiline_chart"},
        ]
      },
      {
        title: "Account",
        icon: "chevron_left",
        subItems: [
          {name: "Logout", icon: "person"},
          {name: "Settings", icon: "settings"},
        ]
      }
    ]
  };
  res.render("dashboard_coach.dust", menu);
});

router.get('/coach/dashboard/clients', (req, res) =>{
  let menu = {
    items: [
      {name: "Dashboard", icon: "web"},
      {name: "Clients", icon: "list"},
      {name: "Schedules", icon: "dashboard"},
      {name: "Chat", icon: "chat"},
    ],
    accordions: [
      {
        title: "Accounting",
        icon: "chevron_left",
        subItems: [
          {name: "Revenue", icon: "show_chart"},
          {name: "Users", icon: "equalizer"},
          {name: "Conversion Rate", icon: "multiline_chart"},
        ]
      },
      {
        title: "Account",
        icon: "chevron_left",
        subItems: [
          {name: "Logout", icon: "person"},
          {name: "Settings", icon: "settings"},
        ]
      }
    ]
  };
  res.render("dashboard_coach_clients.dust", menu);
  })

router.get("/client/dashboard", (req, res) => {
  let menu = {
    items: [
      {name: "Dashboard", icon: "web"},
      {name: "Next Workout", icon: "list"},
      {name: "Schedule", icon: "dashboard"},
      {name: "Chat", icon: "chat"},
    ],
    accordions: [
      {
        title: "Progress",
        icon: "chevron_left",
        subItems: [
          {name: "Weight", icon: "show_chart"},
          {name: "Exercises", icon: "equalizer"},
          {name: "Volume of Training", icon: "multiline_chart"},
        ]
      },
      {
        title: "Account",
        icon: "chevron_left",
        subItems: [
          {name: "Logout", icon: "person"},
          {name: "Settings", icon: "settings"},
        ]
      }
    ]
  };
  res.render("dashboard_client", menu)
});


router.post('/auth', async (req, res) => {
  if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {

    let client = await Credentials.findOne({ username: req.body.username });
    console.log(client);
    if (!client) {
      return res.status(400).send('Incorrect username.');
    }
    const validPassword = await bcrypt.compare(req.body.password, client.password);


    if (!validPassword) {
      return res.status(400).send('Incorrect email or password.');
    }
    //const token = jwt.sign({ _id: client._id }, 'PrivateKey');//send what is needed??
    //return res.header('x-auth-token', token).res.send(client); //todo store on the client side
    let account = await UserAccount.findById(client._userAccountId);
    if (account.accountType === 'coach'){
      res.redirect('/coach/dashboard');
    } else {
      res.redirect('/client/dashboard');
    }
  }
});
router.get('/test', function (req, res) {
  res.render('register_forms/register_1');
  res.end();
})
/** router for /root */
module.exports = router;
