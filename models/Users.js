const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = exports.UsersSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  description: {type: String},
  photo: {type: String},
  birthday: {type: Date, required: true},
  sex: {type: String},
  email: {type: String, required: true},
  phone: {type: String}
});

mongoose.model('Users', UsersSchema);
