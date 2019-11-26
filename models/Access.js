const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Schema = mongoose.Schema;

const CredentialsSchema = exports.CredentialsSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

// function validateCredentials(access) {
//     const obj = {
//         username: Joi.string().min(5).max(50).required(),
//         password: Joi.string().min(5).max(256).required()
//     };
//     return Joi.validate(access, obj);
// }

mongoose.model('Credentials', CredentialsSchema);
// exports.validate = validateCredentials;