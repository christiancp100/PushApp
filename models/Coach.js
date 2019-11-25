const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./UserAccount');
const UserAccount = mongoose.model('UserAccount');

require('./Certificate');
const Certificate = mongoose.model('Certificate');

require('./Rating');
const Rating = mongoose.model('Rating');

require('./Service');
const Service = mongoose.model('Service');

const CoachSchema = exports.CoachSchema = new Schema({
  userAccount: {type: UserAccount, required: true},
  certificate: {type: [Certificate], default: () => []},
  rating: {type: [Rating], default:()=>[]},
  service: {type: [Service], default: () => []},
});

mongoose.model('Coach', CoachSchema);