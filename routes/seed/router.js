/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
let ObjectId = require('mongodb').ObjectID;
const dust = require('dustjs-helpers');//used for helper function inside dust files

require('../../models/UserAccount.js');
require('../../models/Credential.js');
require('../../models/ClientInfo.js');
require('../../models/CoachClients.js');
require('../../models/Rating.js');
require('../../models/MoneyAccount.js');

let UserAccount = mongoose.model('UserAccount');
let ClientInfo = mongoose.model('ClientInfo');
let Credentials = mongoose.model('Credentials');
let CoachClients = mongoose.model('CoachClients');
let MoneyAccount = mongoose.model('MoneyAccount');
let Rating = mongoose.model('Rating');

// GET all
router.get('/', async (req, res) => {
    try {
        let clients = await UserAccount.find({});
        let result = await clients.filter((o) => {
            return (o.isDeleted === false);
        });

        if (req.accepts("text/html")) {
            // let usersModel = {
            //   users: users,
            //   title: "My Canvas"
            // };
            // res.render("result", usersModel);
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

async function createClient(user) {
    let userAccount = new UserAccount({
        firstName: user.firstName,
        lastName: user.lastName,
        description: user.description,
        birthday: user.birthday,
        sex: user.sex,
        email: user.email,
        phone: user.phone,
        address1: user.address1,
        address2: user.address2,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        currency: user.currency,
        localization: user.localization,
        accountType: 'client',
        creationDate: Date.now()
    });
    if (typeof user.photo == "undefined" || user.photo == null || user.photo === "") {
        userAccount.photo = getPhotoPlaceholder(user.sex);
        userAccount.form = 'square';
    } else {
        userAccount.photo = user.photo;
        userAccount.form = user.form;
    }

    let savedUserAccount = await userAccount.save();

    const bcrypt = require('bcrypt');
    let saltedPass = bcrypt.hashSync('admin123', bcrypt.genSaltSync(8), null);
    let newCredentials = new Credentials({
        username: user.username,
        password: saltedPass,
        _userAccountId: savedUserAccount._id
    });
    await newCredentials.save();

    let clientInfo = new ClientInfo({
        _clientId: savedUserAccount._id,
        height: user.height,
        weight: user.weight,
        unitSystem: user.unitSystem
    });

    await clientInfo.save();

    // Creates MoneyAccount for client
    /*let newMoneyAccount = new MoneyAccount({
        _userAccountId: savedUserAccount._id,
        currency: savedUserAccount.currency
    });
    await newMoneyAccount.save();
    console.log('Money account created for this client');*/
    return savedUserAccount;

}

async function createCoach(user) {
    let userAccount = new UserAccount({
        firstName: user.firstName,
        lastName: user.lastName,
        description: user.description,
        birthday: user.birthday,
        sex: user.sex,
        email: user.email,
        phone: user.phone,
        address1: user.address1,
        address2: user.address2,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        currency: user.currency,
        localization: user.localization,
        accountType: 'coach',
        creationDate: Date.now(),
        isDeleted: false
    });
    if (typeof user.photo == "undefined" || user.photo == null || user.photo === "") {
        userAccount.photo = getPhotoPlaceholder(user.sex);
        userAccount.form = 'square';
    } else {
        userAccount.photo = user.photo;
        userAccount.form = user.form;
    }
    if (userAccount.description === undefined) {
        userAccount.description = '';
    }
    if (userAccount.address2 === undefined) {
        userAccount.address2 = '';
    }

    if (!userAccount.photo) {
        userAccount.photo = getPhotoPlaceholder(user.sex)
    } else {
        userAccount.photo = user.photo;
    }

    let savedUser = await userAccount.save();
    console.log(savedUser._id);

    const bcrypt = require('bcrypt');
    let saltedPass = bcrypt.hashSync('admin123', bcrypt.genSaltSync(8), null);
    let newCredentials = new Credentials({
        username: user.username,
        password: saltedPass,
        _userAccountId: savedUser._id
    });
    await newCredentials.save();

    // Creates MoneyAccount for coach
    let newMoneyAccount = new MoneyAccount({
        _userAccountId: savedUser._id,
        currency: savedUser.currency
    });
    await newMoneyAccount.save();
    console.log('Money account created for this coach');

    return savedUser;
}

// Seed new users
router.post('/', async (req, res) => {
        try {
            if (req.get('Content-Type') === "application/json" && req.accepts("application/json")) {
                let qtyCoaches = 15;
                let qtyClients = 25;
                let headers = {'Content-Type': 'application/json'};
                // Female Coaches
                for (let i = 0; i < femaleCoaches.length; i++) {
                    let femaleCoach = femaleCoaches[i];
                    console.log(femaleCoach);
                    let savedFemaleCoach = await createCoach(femaleCoach);
                    console.log('Creating ' + femaleCoach.sex + ' number ' + i + 1);
                }
                // Male Coaches
                for (let j = 0; j < maleCoaches.length; j++) {
                    let maleCoach = maleCoaches[j];
                    console.log(maleCoach);
                    let savedMaleCoach = await createCoach(maleCoach);
                    console.log('Creating ' + maleCoach.sex + ' number ' + j + 1);
                }
                // Female Clients
                for (let k = 0; k < femaleClients.length; k++) {
                    let femaleClient = femaleClients[k];
                    console.log(femaleClient);
                    let savedFemaleClient = await createClient(femaleClient);
                    console.log('Creating ' + femaleClient.sex + ' number ' + k + 1);
                }
                // Male Clients
                for (let m = 0; m < maleClients.length; m++) {
                    let maleClient = maleClients[m];
                    console.log(maleClient);
                    let savedMaleClients = await createClient(maleClient);
                    console.log('Creating ' + maleClient.sex + ' number ' + m + 1);
                }
            }
            res.status(200).end();
        } catch (err) {
            console.log(err);
            res.status(500).end();
        }
    }
);

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
        if (request._clientId !== undefined) {
            filter._clientId = request._clientId;
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
        case 'html':
            return res.set('Content-Type', 'text/html');
        case 'error':
            res.json(msg);
            return res;
        default:
            break;
    }
}

function getPhotoPlaceholder(sex) {
    switch (sex) {
        case 'female':
            return '/img/placeholders/client_female.jpg';
        case 'male':
            return '/img/placeholders/client_male.jpg';
    }
}

// USER SEEDS
const maleCoaches = [
    {
        "currency": "chf",
        "firstName": "Delaney",
        "lastName": "Winslett",
        "email": "dwinslett0@alexa.com",
        "sex": "male",
        "birthday": "2/5/1974",
        "phone": "309-687-0585",
        "address1": "2 Continental Plaza",
        "city": "Peoria",
        "state": "Illinois",
        "zipCode": "61651",
        "country": "United States",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_male.jpg",
        "username": "dwinslett0",
        "password": "abcD1234",
        "description": "It’s time"
    },
    {
        "currency": "chf",
        "firstName": "Luce",
        "lastName": "Deniso",
        "email": "ldeniso1@ft.com",
        "sex": "male",
        "birthday": "1/2/2003",
        "phone": "213-653-9845",
        "address1": "976 Ridge Oak Trail",
        "city": "Los Angeles",
        "state": "California",
        "zipCode": "90087",
        "country": "United States",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_male.jpg",
        "username": "ldeniso1",
        "password": "abcD1234",
        "description": "Get In. Get Fit"
    },
    {
        "currency": "chf",
        "firstName": "Herb",
        "lastName": "Mallabone",
        "email": "hmallabone2@netlog.com",
        "sex": "male",
        "birthday": "8/27/1969",
        "phone": "510-715-0630",
        "address1": "31673 School Circle",
        "city": "Oakland",
        "state": "California",
        "zipCode": "94605",
        "country": "United States",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_male.jpg",
        "username": "hmallabone2",
        "password": "abcD1234",
        "description": "Respect All"
    },
    {
        "currency": "chf",
        "firstName": "Welsh",
        "lastName": "Durrad",
        "email": "wdurrad3@census.gov",
        "sex": "male",
        "birthday": "3/23/1965",
        "phone": "816-623-8889",
        "address1": "3 Mallory Plaza",
        "city": "Kansas City",
        "state": "Missouri",
        "zipCode": "64193",
        "country": "United States",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_male.jpg",
        "username": "wdurrad3",
        "password": "abcD1234",
        "description": "Rest a while and run a mile"
    },
    {
        "currency": "chf",
        "firstName": "Berton",
        "lastName": "Panter",
        "email": "bpanter4@springer.com",
        "sex": "male",
        "birthday": "4/16/1974",
        "phone": "772-898-8373",
        "address1": "0624 Old Shore Hill",
        "city": "West Palm Beach",
        "state": "Florida",
        "zipCode": "33405",
        "country": "United States",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_male.jpg",
        "username": "bpanter4",
        "password": "abcD1234",
        "description": "Everyday is a choice"
    }
];

const femaleCoaches = [
    {
        "currency": "chf",
        "firstName": "Peggi",
        "lastName": "Clampin",
        "email": "pclampin0@tumblr.com",
        "sex": "female",
        "birthday": "10/13/1976",
        "phone": "334-977-4872",
        "address1": "206 Dapin Way",
        "city": "Montgomery",
        "state": "Al",
        "zipCode": "36195",
        "country": "United States",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_female.jpg",
        "username": "pclampin0",
        "password": "abcD1234",
        "description": "I love teaching fitness to all my students"
    },
    {
        "currency": "chf",
        "firstName": "Ruthy",
        "lastName": "Goggan",
        "email": "rgoggan1@w3.org",
        "sex": "female",
        "birthday": "7/19/1979",
        "phone": "435-698-2953",
        "address1": "5 Merchant Place",
        "city": "Los Patios", "state": "Al",
        "zipCode": "541018",
        "country": "Colombia",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_female.jpg",
        "username": "rgoggan1",
        "password": "abcD1234",
        "description": "Let’s Roll"
    },
    {
        "currency": "chf",
        "firstName": "Odelle",
        "lastName": "Kewley",
        "email": "okewley2@ebay.com",
        "sex": "female",
        "birthday": "9/7/1978",
        "phone": "936-866-1112",
        "address1": "87888 Fairview Alley",
        "city": "Sanjian", "state": "Al",
        "country": "China", "zipCode": "61651",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_female.jpg",
        "username": "okewley2",
        "password": "abcD1234",
        "description": "Everyday is a choice"
    },
    {
        "currency": "chf",
        "firstName": "Jacinda",
        "lastName": "Awin",
        "email": "jawin3@list-manage.com",
        "sex": "female",
        "birthday": "1/23/2006",
        "phone": "333-772-3255",
        "address1": "8850 Thierer Court",
        "city": "Magtaking", "state": "Al",
        "zipCode": "2416",
        "country": "Philippines",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_female.jpg",
        "username": "jawin3",
        "password": "abcD1234",
        "description": "You can do it!"
    },
    {
        "currency": "chf",
        "firstName": "Salaidh",
        "lastName": "Myerscough",
        "email": "smyerscough4@home.pl",
        "sex": "female",
        "birthday": "11/16/1992",
        "phone": "753-697-0212",
        "address1": "37915 Lillian Way",
        "city": "Moog", "state": "Al",
        "zipCode": "9019",
        "country": "Philippines",
        "accountType": "coach",
        "photo": "/img/placeholders/coach_female.jpg",
        "username": "smyerscough4",
        "password": "abcD1234",
        "description": "Strong to the Finish"
    }
];

const maleClients = [
    {
        "currency": "chf",
        "firstName": "Northrop",
        "lastName": "Holdren",
        "email": "nholdren0@spotify.com",
        "sex": "male",
        "birthday": "2/29/1980",
        "phone": "585-636-2019",
        "address1": "99 Bowman Circle",
        "city": "Szeged",
        "state": "Csongrád",
        "zipCode": "6728",
        "country": "Hungary",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "nholdren0",
        "password": "abcD1234",
        "height": 150,
        "weight": 97,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Dennison",
        "lastName": "Rattrie",
        "email": "drattrie1@paypal.com",
        "sex": "male",
        "birthday": "10/23/1994",
        "phone": "142-866-1241",
        "address1": "4 Bonner Park", "zipCode": "61651",
        "city": "Opuwo", "state": "Al",
        "country": "Namibia",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "drattrie1",
        "password": "abcD1234",
        "height": 156,
        "weight": 79,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Ermanno",
        "lastName": "Lynett",
        "email": "elynett2@fc2.com",
        "sex": "male",
        "birthday": "7/31/2010",
        "phone": "550-118-1039",
        "address1": "7 Blackbird Parkway",
        "city": "Mailag", "state": "Al",
        "zipCode": "1602",
        "country": "Philippines",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "elynett2",
        "password": "abcD1234",
        "height": 153,
        "weight": 92,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Reggie",
        "lastName": "Lansdowne",
        "email": "rlansdowne3@economist.com",
        "sex": "male",
        "birthday": "2/28/1998",
        "phone": "207-524-9152",
        "address1": "30 Chinook Hill",
        "city": "Parigi", "state": "Al",
        "country": "Indonesia", "zipCode": "61651",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "rlansdowne3",
        "password": "abcD1234",
        "height": 173,
        "weight": 85,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Jud",
        "lastName": "Braganza",
        "email": "jbraganza4@instagram.com",
        "sex": "male",
        "birthday": "1/26/1967",
        "phone": "984-451-0202",
        "address1": "70272 Lindbergh Circle",
        "city": "Skoútari", "state": "Al",
        "country": "Greece", "zipCode": "61651",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "jbraganza4",
        "password": "abcD1234",
        "height": 179,
        "weight": 66,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Faber",
        "lastName": "Rathjen",
        "email": "frathjen5@pagesperso-orange.fr",
        "sex": "male",
        "birthday": "10/11/2005",
        "phone": "213-420-1713",
        "address1": "6 Holy Cross Pass",
        "city": "Quirinópolis", "state": "Al",
        "zipCode": "75860-000",
        "country": "Brazil",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "frathjen5",
        "password": "abcD1234",
        "height": 197,
        "weight": 109,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Teddy",
        "lastName": "Aggio",
        "email": "taggio6@nba.com",
        "sex": "male",
        "birthday": "6/10/1988",
        "phone": "987-676-5890",
        "address1": "6 Thompson Lane",
        "city": "Uzgen", "state": "Al",
        "country": "Kyrgyzstan", "zipCode": "61651",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "taggio6",
        "password": "abcD1234",
        "height": 188,
        "weight": 88,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "George",
        "lastName": "Kewley",
        "email": "gkewley7@mashable.com",
        "sex": "male",
        "birthday": "1/22/1963",
        "phone": "672-221-1852",
        "address1": "59 Corry Crossing",
        "city": "Pagaden", "state": "Al",
        "country": "Indonesia", "zipCode": "61651",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "gkewley7",
        "password": "abcD1234",
        "height": 155,
        "weight": 93,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Alec",
        "lastName": "Megarrell",
        "email": "amegarrell8@tumblr.com",
        "sex": "male",
        "birthday": "6/29/1998",
        "phone": "160-153-5093",
        "address1": "48 Delaware Alley",
        "city": "Ban Lŭng", "state": "Al",
        "country": "Cambodia", "zipCode": "61651",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "amegarrell8",
        "password": "abcD1234",
        "height": 178,
        "weight": 105,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Webster",
        "lastName": "McCreery",
        "email": "wmccreery9@yolasite.com",
        "sex": "male",
        "birthday": "8/1/2004",
        "phone": "535-752-5992",
        "address1": "291 American Terrace",
        "city": "Puji", "state": "Al",
        "country": "China", "zipCode": "61651",
        "accountType": "client",
        "photo": "/img/placeholders/client_male.jpg",
        "username": "wmccreery9",
        "password": "abcD1234",
        "height": 196,
        "weight": 112,
        "unitSystem": "metric"
    }
];

const femaleClients = [
    {
        "currency": "chf",
        "firstName": "Tildy",
        "lastName": "Dunk",
        "email": "tdunk0@unicef.org",
        "sex": "female",
        "birthday": "9/5/1965",
        "phone": "662-559-0230",
        "address1": "33 Helena Plaza",
        "city": "Karlskrona",
        "state": "Blekinge",
        "zipCode": "371 84",
        "country": "Sweden",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "tdunk0",
        "password": "abcD1234",
        "height": 193,
        "weight": 102,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Aryn",
        "lastName": "Corser",
        "email": "acorser1@netlog.com",
        "sex": "female",
        "birthday": "4/1/2007",
        "phone": "570-377-6026",
        "address1": "02 Mosinee Way",
        "city": "Mniszków", "state": "Al",
        "zipCode": "26-341",
        "country": "Poland",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "acorser1",
        "password": "abcD1234",
        "height": 164,
        "weight": 70,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Georgeanna",
        "lastName": "Deehan",
        "email": "gdeehan2@sbwire.com",
        "sex": "female",
        "birthday": "4/30/1966",
        "phone": "566-161-7677",
        "address1": "14394 Transport Avenue",
        "city": "Chhāgalnāiya", "state": "Al",
        "zipCode": "3913",
        "country": "Bangladesh",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "gdeehan2",
        "password": "abcD1234",
        "height": 182,
        "weight": 77,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Margeaux",
        "lastName": "Klauer",
        "email": "mklauer3@comcast.net",
        "sex": "female",
        "birthday": "10/10/1970",
        "phone": "449-807-8744",
        "address1": "0626 Kinsman Way",
        "city": "Stýpsi", "state": "Al",
        "country": "Greece", "zipCode": "61651",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "mklauer3",
        "password": "abcD1234",
        "height": 157,
        "weight": 120,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Hanna",
        "lastName": "Elgie",
        "email": "helgie4@soup.io",
        "sex": "female",
        "birthday": "11/20/1994",
        "phone": "314-202-9771",
        "address1": "002 Corscot Court",
        "city": "Abū Mūsā", "state": "Al",
        "country": "Iran", "zipCode": "61651",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "helgie4",
        "password": "abcD1234",
        "height": 196,
        "weight": 110,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Leandra",
        "lastName": "Rosenkranc",
        "email": "lrosenkranc5@i2i.jp",
        "sex": "female",
        "birthday": "5/13/2006",
        "phone": "936-459-3575",
        "address1": "8 Vahlen Pass",
        "city": "Beaumont",
        "state": "Texas",
        "zipCode": "77705",
        "country": "United States",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "lrosenkranc5",
        "password": "abcD1234",
        "height": 172,
        "weight": 105,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Barbaraanne",
        "lastName": "McKirdy",
        "email": "bmckirdy6@wordpress.org",
        "sex": "female",
        "birthday": "6/13/2007",
        "phone": "867-117-9183",
        "address1": "87702 Shelley Point",
        "city": "Guéret",
        "state": "Limousin",
        "zipCode": "23016 CEDEX",
        "country": "France",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "bmckirdy6",
        "password": "abcD1234",
        "height": 186,
        "weight": 114,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Gertrudis",
        "lastName": "Aglione",
        "email": "gaglione7@amazon.co.uk",
        "sex": "female",
        "birthday": "4/1/2005",
        "phone": "961-839-0179",
        "address1": "4 Badeau Circle",
        "city": "Bratslav", "state": "Al",
        "country": "Ukraine", "zipCode": "61651",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "gaglione7",
        "password": "abcD1234",
        "height": 191,
        "weight": 102,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Marjie",
        "lastName": "Duffett",
        "email": "mduffett8@usgs.gov",
        "sex": "female",
        "birthday": "9/10/2007",
        "phone": "937-956-8997",
        "address1": "430 Erie Pass",
        "city": "Volgorechensk", "state": "Al",
        "zipCode": "156901",
        "country": "Russia",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "mduffett8",
        "password": "abcD1234",
        "height": 190,
        "weight": 112,
        "unitSystem": "metric"
    },
    {
        "currency": "chf",
        "firstName": "Linell",
        "lastName": "Hamal",
        "email": "lhamal9@desdev.cn",
        "sex": "female",
        "birthday": "11/17/2005",
        "phone": "968-110-0702",
        "address1": "0468 Merchant Lane",
        "city": "Siay",
        "zipCode": "7006",
        "country": "Philippines", "state": "Al",
        "accountType": "client",
        "photo": "/img/placeholders/client_female.jpg",
        "username": "lhamal9",
        "password": "abcD1234",
        "height": 181,
        "weight": 118,
        "unitSystem": "metric"
    }
];

module.exports = router;
