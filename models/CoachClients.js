const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CoachClientsSchema = exports.CoachClientsSchema = new Schema({
    _coachId: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},
    _clientId: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},
});

mongoose.model('CoachClients', CoachClientsSchema);