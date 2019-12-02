/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('../../models/Credential.js');
require('../../models/UserAccount.js');
require('../../models/ClientInfo.js');
require('../../models/CoachClients')

let Credentials = mongoose.model('Credentials');
let UserAccount = mongoose.model('UserAccount');
let ClientInfo = mongoose.model('ClientInfo');
let CoachClients = mongoose.model('CoachClients');

router.get('/', function (req, res, next) {
    if (req.accepts("html")) {
        res.render('index', {title: 'PushApp'});
    } else {
        // res.status(500);
        res.end();
    }
});

// Dynamic user route according to userAccount type
router.get('/:username', async (req, res, next) => {
    try {
        if (req.accepts("html")) {
            const filter = getFilter(req);

            if (req.path === '/login') {
                res.render('login.dust')
            } else if (req.path === '/register') {
                // ADD HERE CORRECT RENDERER!!!
                // res.render('register_forms/coach-register');
            } else if (req.path === '/register-coach') {
                res.render('register_forms/coach-register');
            } else if (req.path === '/register-client') {
                res.render('register_forms/client-register');
            } else {
                let credentials = await Credentials.findOne(filter);
                console.log();
                if (credentials === null || credentials.username !== filter.username) {
                    // CHANGE FOR CORRECT 404 PAGE
                    res = setResponse('json', 401, res, {Error: 'Unauthorized access!'});
                } else {
                    let activeUser = await UserAccount.findById({_id: credentials._userAccountId});

                    if (activeUser.accountType === 'client') {
                        await renderClientDashboard(res, activeUser);
                    }
                    if (activeUser.accountType === 'coach') {
                        await renderCoachDashboard(res, activeUser);
                    }
                    if (activeUser.accountType === 'admin') {
                        await renderAdminDashboard(res);
                    }
                }
            }

        }
        res.end();
    } catch
        (err) {
        res.status(500);
        res.end();
    }
})
;

async function renderClientDashboard(res, activeUser) {
    if (activeUser.photo === null || activeUser.photo === ' ') {
        activeUser.photo = '/img/icons/user-pic.png';
    }
    let menu = {
        user:
            {
              firstName: activeUser.firstName,
              photo: activeUser.photo
            }
        ,
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
    res.render("dashboard_client", menu);
}

async function clientsDropdown(activeUser) {
    let clientsArray = [];
    if (activeUser.id !== undefined && !mongoose.Types.ObjectId.isValid(activeUser.id)) {
        return [];
    }
    try {
        let result = await CoachClients.find({_coachId: activeUser.id});
        if (result) {
            console.log(result);
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    try {
                        let found = await UserAccount.findById(result[i]._clientId);
                        console.log("AAA" , found);
                        let clientInfo = {
                            firstName: found.firstName,
                            lastName: found.lastName,
                            photo: found.photo,
                        };
                        clientsArray.push(clientInfo);
                    } catch (e) {
                        console.log(e);
                        return [];
                    }
                }
            } else {
                console.log('No client hired you...');
                return [];
            }
        }
    }catch(e){
        console.log(e);
        return [];
    }
    return clientsArray;
}

async function renderCoachDashboard(res, activeUser) {
    if (activeUser.photo === null || activeUser.photo === ' ') {
        activeUser.photo = '/img/icons/user-pic.png';
    }
    let menu = {
        user: [
            {firstName: "Coach " + activeUser.firstName},
            {photo: activeUser.photo}
        ],
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
                    {name: "Logout", icon: "person", logout : "true"},
                    {name: "Settings", icon: "settings"},
                ]
            }
        ],
        clients : await clientsDropdown(activeUser)
    };
    res.render("dashboard_coach.dust", menu);
}

async function renderAdminDashboard(res) {
    //  Add render here code for admin
    res.end();
}

// Creates filter for searching users on the database
function getFilter(req) {
    const filter = {};
    let request;

    if (Object.keys(req.body).length > 0) {
        request = req.body;
    } else if (Object.keys(req.query).length > 0) {
        request = req.query;
    } else if (Object.keys(req.params).length > 0) {
        request = req.params;
    }

    if (request !== undefined) {
        // Filter by user ID
        if (request.id !== undefined && mongoose.Types.ObjectId.isValid(request.id)) {
            filter._userAccountId = request.id.toLowerCase();
        }

        // Filter by user's last name
        if (request.username !== undefined) {
            filter.username = request.username.toLowerCase();
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
        case 'html':
            return res.set('Content-Type', 'text/html');
        case 'error':
            res.json(msg);
            return res;
        default:
            break;
    }
}

//// USER ACCOUNT CREATION AND USER AUTHENTICATION
// router.get('/register-coach', (req, res, next) => {
//     res.render('register_forms/coach-register');
// });

// router.get('/register-client', (req, res, next) => {
//     res.render('register_forms/client-register');
// });

// router.get('/coach/dashboard', (req, res) => {
//     let menu = {
//         items: [
//             {name: "Dashboard", icon: "web"},
//             {name: "Clients", icon: "list"},
//             {name: "Schedules", icon: "dashboard"},
//             {name: "Chat", icon: "chat"},
//         ],
//         accordions: [
//             {
//                 title: "Accounting",
//                 icon: "chevron_left",
//                 subItems: [
//                     {name: "Revenue", icon: "show_chart"},
//                     {name: "Users", icon: "equalizer"},
//                     {name: "Conversion Rate", icon: "multiline_chart"},
//                 ]
//             },
//             {
//                 title: "Account",
//                 icon: "chevron_left",
//                 subItems: [
//                     {name: "Logout", icon: "person"},
//                     {name: "Settings", icon: "settings"},
//                 ]
//             }
//         ]
//     };
//     res.render("dashboard_coach.dust", menu);
// });

router.get('/coach/dashboard/clients', (req, res) => {
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
});

// router.get("/client/dashboard", (req, res) => {
//     let menu = {
//         items: [
//             {name: "Dashboard", icon: "web"},
//             {name: "Next Workout", icon: "list"},
//             {name: "Schedule", icon: "dashboard"},
//             {name: "Chat", icon: "chat"},
//         ],
//         accordions: [
//             {
//                 title: "Progress",
//                 icon: "chevron_left",
//                 subItems: [
//                     {name: "Weight", icon: "show_chart"},
//                     {name: "Exercises", icon: "equalizer"},
//                     {name: "Volume of Training", icon: "multiline_chart"},
//                 ]
//             },
//             {
//                 title: "Account",
//                 icon: "chevron_left",
//                 subItems: [
//                     {name: "Logout", icon: "person"},
//                     {name: "Settings", icon: "settings"},
//                 ]
//             }
//         ]
//     };
//     res.render("dashboard_client", menu)
// });

// router.get('/auth', function (req, res) {
//     res.render('login.dust')
// });

router.post('/login', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || req.get('Content-Type') === "application/x-www-form-urlencoded" && req.body !== undefined) {

        let client = await Credentials.findOne({username: req.body.username});
        console.log(client);
        if (!client) {
            return res.status(400).send('Incorrect username or password!');
        }
        const validPassword = await bcrypt.compare(req.body.password, client.password);


        if (!validPassword) {
            return res.status(400).send('Incorrect username or password.');
        }
        //const token = jwt.sign({ _id: client._id }, 'PrivateKey');//send what is needed??
        //return res.header('x-auth-token', token).res.send(client); //todo store on the client side
        let account = await UserAccount.findById(client._userAccountId);
        res.redirect('/' + client.username);
        // if (account.accountType === 'coach') {
        //     res.redirect('/coach/dashboard');
        // } else {
        //     res.redirect('/client/dashboard');
        // }
    }
});

router.get('/test', function (req, res) {
    res.render('register_forms/register_1');
    res.end();
});

/** router for /root */
module.exports = router;
