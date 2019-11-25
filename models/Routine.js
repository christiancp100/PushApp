const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./Exercise');
const Exercise = mongoose.model('Exercise');

const RoutineSchema = exports.RoutineSchema = new Schema({
    exercises: {type: [Exercise],  default: () => []},
    day: {type: Date, required:true},
    duration: {type: Number, required:true },
    difficultyLevel: {type: Number, required:true},
    bodyParts:{type: String},
});

mongoose.model('Exercise', ExerciseSchema);
