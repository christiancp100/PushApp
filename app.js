const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dust = require('klei-dust');
const methodOverride = require('method-override');
const routers = require('./routes/routers');
const EventEmitter = require('events');
const mongoose = require('mongoose');
const app = express();

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
app.use('/', routers.root);
app.use('/test/fetch', routers.fetch_tests);
app.use('/users', routers.users);

// Catch 404 and forward to error handler
// This should be configured after all 200 routes
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Mongoose connection to MongoDB and Collection name declaration
mongoose.connect('mongodb://localhost/PushApp');

// Socket.io Emitter
const emitter = new EventEmitter()

// Dust views rendering engine
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
app.engine('dust', dust.dust);

module.exports = app;
module.exports = emitter;
