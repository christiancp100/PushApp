const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Routine = require('./Routine');

const ScheduleSchema = exports.ScheduleSchema = new Schema({
    _coachId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount', required: false}, //TODO put required to true ahgain
    _clientId: {type: mongoose.Schema.Types.ObjectId, ref: 'UserAccount', required: false},
    creationDate: {type: Date, required: true},
    finalDate: {type: Number, required: true},
    duration: {type: Number, required: true},
    routines: {type: [Schema.Types.ObjectId], ref: 'Routine', require: true},
});

mongoose.model('Schedule', ScheduleSchema);
