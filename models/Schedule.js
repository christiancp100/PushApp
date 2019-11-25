const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./Routine');
const Routine = mongoose.model('Routine');

const ScheduleSchema = exports.ScheduleSchema = new Schema({
    ownerID : {type: mongoose.Schema.Types.ObjectId},
    clientID : {type: mongoose.Schema.Types.ObjectId},
    creationDate: {type: Date, required:true},
    finalDate: {type: Number, required:true },
    duration: {type: Number, required:true},
    routines:{type:[Routine], require:true},
});

mongoose.model('Schedule', ScheduleSchema);
