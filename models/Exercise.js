const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = exports.ExerciseSchema = new Schema({
    name: {type: String, required:true},
    // description: {type: String, required:true}, TODO description taken from the API
    feedback: {type: String, required:true},
    //id: {type: Number, required:true}, TODO id taken from the API
    weightUnit: {type: String, required:true },
    pumpWeight: {type: Number, required:true },
    bodyPart: {type: String},    //taken from the API(?)
    set:{type: Number},
    repetitions: {type:Number}
});

mongoose.model('Exercise', ExerciseSchema);
