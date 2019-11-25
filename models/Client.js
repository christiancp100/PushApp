const mongoose = require('mongoose');
const Schedule = require('Schedule.js');
const Schema = mongoose.Schema;

const ClientSchema = exports.ClientSchema = new Schema({
    height: {type: Number},
    weight: {type: Number},
    bmi: {type: Number},
    unitSystem: {type: String, default: 'metric'},
    schedule: {type: Schedule}
});

mongoose.model('Client', ClientSchema);
