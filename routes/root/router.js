/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  if (req.accepts("html")) {
    res.render('index', {title: 'PushApp'});
  } else {
    res.status(500);
    res.end();
  }
});


router.get('/register', (req, res, next) => {
  //TODO if the user is logged in, redirect to the admin panel
  //First part of the register form, just select coach or user
  res.render("register_forms/register_1", {});
});

router.post('/register', function (req, res, next) {
    //Check data
    if (req.body.typeofuser == "coach") {
      res.render("register_3_coach", {});
    } else if (req.body.typeofuser == "client") {
      res.render("register_3_client", {});
    } else {
      res.status(400).render("error");
    }
  }
);

router.post('/register-coach', function (req, res, next) {
  let body = JSON.parse(req.body);
  console.log(body.email, body.password, body.typeofuser);

  res.status(200);
});

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

router.get('/testing', function (req, res) {
    res.type('text/html');
    //res.render('register_forms/coach-register');
    res.render('register_forms/client-register');
    //res.render('register_forms/register_1');
})

/** router for /root */
module.exports = router;
