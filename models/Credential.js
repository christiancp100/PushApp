const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CredentialsSchema = exports.CredentialsSchema = new Schema({
    _clientId: {type: Schema.Types.ObjectId, ref: 'Client', required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
});

mongoose.model('Credentials', CredentialsSchema);
