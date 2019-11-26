const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserAccount = require('./UserAccount');
const Certificate = require('./Certificate');
const Rating = require('./Rating');
const Service = require('./Service');

const CoachSchema = exports.CoachSchema = new Schema({
    _userAccount: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},
    ratings: {type: [Schema.Types.ObjectId], ref: 'Rating', default: () => []},
    services: {type: [Schema.Types.ObjectId], ref: 'Service', default: () => []},
});

mongoose.model('Coach', CoachSchema);