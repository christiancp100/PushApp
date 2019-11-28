const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CredentialsSchema = exports.CredentialsSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    _userAccountId: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true}
});

mongoose.model('Credentials', CredentialsSchema);
