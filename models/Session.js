const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Exercise = require('./Exercise');

const SessionSchema = exports.SessionSchema = new Schema({
    _coachId: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},
    _clientId: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},
    weekday: {type: Date, required: true},
    exercises: {type: [Schema.Types.ObjectId], ref: 'Exercise', default: () => []},
    duration: {type: Number}
    // difficultyLevel: {type: Number, required: true}
});

mongoose.model('Session', SessionSchema);