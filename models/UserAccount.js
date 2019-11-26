const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Credentials = require('./Credential');

const UserAccountSchema = exports.UserAccountSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    description: {type: String},
    photo: {type: String},
    birthday: {type: Date},
    sex: {type: String},
    email: {type: String},
    phone: {type: String},
    address1: {type: String},
    address2: {type: String},
    city: {type: String},
    state: {type: String},
    zipCode: {type: String},
    country: {type: String},
    currency: {type: String},
    localization: {type: String, default: 'en-US'},
    creationDate: {type: Date, default: Date.now()},
    accessHistory: {type: [Date], default: () => []},
    _credentials: {type: Schema.Types.ObjectId, ref: 'Credentials', required: true}
});

mongoose.model('UserAccount', UserAccountSchema);