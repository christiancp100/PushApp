const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const Access = exports.Access = new Schema({
    username: {type: String,
        required: true,
        minlength: 5,
        maxlength: 50},
    password : {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 256
    }
});

function validateAccess(access) {
    const obj = {
        username : Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(256).required()
    };
    return Joi.validate(access, obj);
}

mongoose.model('Access', Access);
exports.validate = validateAccess;