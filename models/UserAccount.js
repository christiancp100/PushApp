const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Credentials = require('./Credential');

const UserAccountSchema = exports.UserAccountSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    description: {type: String},
    photo: {type: String},
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
    creationDate: {type: Date, default: Date.now()},
    accessHistory: {type: [Date], default: () => []},
    _credentials: {type: Schema.Types.ObjectId, ref: 'Credentials', required: true}
});

mongoose.model('UserAccount', UserAccountSchema);