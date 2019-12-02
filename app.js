const methodOverride = require('method-override');
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

// Mongoose connection to MongoDB and Collection name declaration

/*const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://christiancp:pushapp123@pushapp-yvfjb.mongodb.net/PushApp?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});*/



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

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({extended: true}));

// Initialize routers here
const routers = require('./routes/routers');
app.use('/', routers.root);
app.use('/auth', routers.auth);
app.use('/clients', routers.client);
app.use('/coaches', routers.coach);
app.use('/workouts', routers.workout);

// Catch 404 and forward to error handler
// This should be configured after all 200 routes
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
