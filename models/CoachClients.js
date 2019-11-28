const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserAccount = require('./UserAccount');
const Service = require('./Service');

const CoachSchema = exports.CoachSchema = new Schema({
    _coachAccount: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},
    _clientsHiring: {type: [Schema.Types.ObjectId], ref: 'UserAccount', default: () => []},
});

mongoose.model('Coach', CoachSchema);