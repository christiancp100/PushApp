const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = exports.FavoritesSchema = new Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  description: {type: String, required: true},
  height: {type: float, required: true},
  weight: {type: float, required: true},
  birthday: {type: Date, required: true},
  sex: {type: String},
  email: {type: String},
  phoneNumber: {type: String}
})

mongoose.model('Users', UsersSchema)
