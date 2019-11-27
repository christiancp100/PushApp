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

router.get('/test', function (req, res) {
    let date = new Date();
    //max date is maximum date to be registered (today)
    let neededDate = "" + date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    let obj = {
        firstName : 'maxim',
        maxDate : neededDate,
        weight : null
    }
    res.render('user-register', obj);

})

router.get('/register', (req, res, next) => {
  //TODO if the user is logged in, redirect to the admin panel
  //First part of the register form, just select coach or user
    res.render("register_forms/register_3_coach", {});
});

router.post('/register', function (req, res, next) {
    //Check data
    if(req.body.typeofuser == "coach"){
        res.render("register_3_coach", {});
    }else if(req.body.typeofuser == "client"){
        res.render("register_3_client", {});
    }else{
      res.status(400).render("error");
    }
  }
);

router.post('/register-coach', function (req, res, next){
    let body = JSON.parse(req.body);
    console.log(body.email, body.password, body.typeofuser);

    res.status(200);
});

router.get('/login', (req, res) => {
  res.render("dashboard_coach.dust", {});
});
router.get('/testing', function (req, res) {
    res.type('text/html');
    res.render('coach-board', {});
})
/** router for /root */
module.exports = router;
