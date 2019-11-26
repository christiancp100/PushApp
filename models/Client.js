const mongoose = require('mongoose');
require('./UserAccount');
require('./Schedule');
const Schema = mongoose.Schema;

const ClientSchema = exports.ClientSchema = new Schema({
    userAccount: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},
    height: {type: Number},
    weight: {type: Number},
    bmi: {type: Number},
    unitSystem: {type: String, default: 'metric'},
    schedule: {type: Schema.Types.ObjectId, ref: 'Schedule', required: true}
});

mongoose.model('Client', ClientSchema);
