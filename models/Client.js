const mongoose = require('mongoose');
const UserAccount = require('./UserAccount');
const Schedule = require('./Schedule');
const Schema = mongoose.Schema;

const ClientSchema = exports.ClientSchema = new Schema({
    /*TODO change useraccount field to reference*/
    userAccount: {type: UserAccount, required: true},
    height: {type: Number},
    weight: {type: Number},
    bmi: {type: Number},
    unitSystem: {type: String, default: 'metric'},
    schedule: {type: Schedule}
});

mongoose.model('Client', ClientSchema);
