const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = exports.RatingSchema = new Schema({
    score: {type: Number, required:true},
    comment: {type: String, required:true},
    date: {type: Date, required:true},
});

mongoose.model('Rating', RatingSchema);
