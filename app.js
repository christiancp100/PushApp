const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const emitter = require('./socketIoEmitter.js');
const express = require('express');
const dust = require('klei-dust');
const logger = require('morgan');
const path = require('path');
const app = express();

// Models
require('./models/ClientInfo.js');
require('./models/Credential.js');
require('./models/UserAccount.js');
require('./models/CoachClients.js');
require('./models/Transaction.js');
require('./models/MoneyAccount.js');

//require('dotenv').config(); //

// Mongoose connection to MongoDB and Collection name declaration
mongoose.connect('mongodb://localhost/PushApp', {useNewUrlParser: true, useUnifiedTopology: true});

// Dust views rendering engine
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
app.engine('dust', dust.dust);

// Configure app
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));

//for passport js
app.use(require('express-session')({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
    maxAge: 24 * 60 * 60 * 1000/*a day long*/
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(bodyParser.text({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

require('./config/passport')(passport);
require('./routes/index.js')(app, passport);

// Initialize routers here
const routers = require('./routes/routers');
app.use('/', routers.root);
app.use('/auth', routers.auth);
app.use('/clients', routers.client);
app.use('/coaches', routers.coach);
app.use('/workouts', routers.workout);
app.use('/checkout', routers.checkout);
app.use('/money', routers.money);

// Catch 404 and forward to error handler
// This should be configured after all 200 routes
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

console.log("The server is running on port 3000")
module.exports = app;
