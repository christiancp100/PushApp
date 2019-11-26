const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Routine = require('./Routine');

const ScheduleSchema = exports.ScheduleSchema = new Schema({
    ownerID: {type: mongoose.Schema.Types.ObjectId},
    clientID: {type: mongoose.Schema.Types.ObjectId},
    creationDate: {type: Date, required: true},
    finalDate: {type: Number, required: true},
    duration: {type: Number, required: true},
    routines: {type: [Schema.Types.ObjectId], ref: 'Routine', require: true},
});

mongoose.model('Schedule', ScheduleSchema);
