const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./Credential');

const UserAccountSchema = exports.UserAccountSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    description: {type: String,},
    photo: { data: Buffer, contentType: String },
    birthday: {type: Date, required: true},
    sex: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    address1: {type: String, required: true},
    address2: {type: String},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zipCode: {type: String, required: true},
    country: {type: String, required: true},
    currency: {type: String, required: true},
    localization: {type: String, default: 'en-US'},
    accountType: {type: String, required: true},
    creationDate: {type: Date, default: Date.now()},
    accessHistory: {type: [Date], default: () => []},
    isDeleted: {type: Boolean, default: false},
});

mongoose.model('UserAccount', UserAccountSchema);
