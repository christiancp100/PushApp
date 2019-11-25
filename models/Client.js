const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = exports.ClientSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  description: {type: String},
  photo: {type: String},
  birthday: {type: Date, required: true},
  sex: {type: String},
  height: {type: Number},
  weight: {type: Number},
  bmi: {type: Number},
  unitSystem: {type: String, default: 'metric'},
  email: {type: String, required: true},
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
  accessHistory: {type: [Date], default: []},
  authenticationProvider: {type: String},
  isDeleted: {type: Boolean, default: false},
  isDeletedBy: {type: String}
});

mongoose.model('Client', ClientSchema);
