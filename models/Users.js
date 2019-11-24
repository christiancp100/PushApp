const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = exports.UsersSchema = new Schema({
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
  contactInfo: {
    email: {type: String, required: true},
    phone: {type: String},
    address1: {type: String},
    address2: {type: String},
    city: {type: String},
    state: {type: String},
    zipCode: {type: String},
    country: {type: String}
  },
  currency: {type: String},
  localization: {type: String, default: 'en-US'},
  creationDate: {type: Date, default: Date.now()},
  accessHistory: {type: [Date], default: []},
  authenticationProvider: {type: String}
});

mongoose.model('Users', UsersSchema);
