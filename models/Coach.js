const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./UserAccount');
const UserAccount = mongoose.model('UserAccount');

// const Certificate = new Certificate({
//   file: {}
// });
//
// const Fee = new Schema({
//   price: {type: Number, required: true},
//   period: {type: Number, required: true}
// });
//
// const Rating = new Schema({
//   score: {type: Number},
//   text: {type: String},
//   date: {type: Date, default: Date.now()},
// });
//
// const Exercise = new Schema({
//   name: {type: String, required: true},
//   //to discuss
//   //some other stuff retrieved from the API
// });
//
// const TrainingSession = new Schema({
//   exercise: {type: [Exercise], default: () => []},
//   startTime: {type: Number, required: true},
//   endTime: {type: Number, required: true}
// });
//
//
// const Schedule = new Schema({
//   duration: {type: Number, required: true},
//   trainingSession: {type: [TrainingSession], default: () => []},
// });

const CoachSchema = exports.CoachSchema = new Schema({
  userAccount: {type: UserAccount, required: true},
  certificates: {type: [Certificate], default: () => []},
  offers: {type: [Fee], default: () => []},
  rating: {type: [Rating], default: () => []},
  schedule: {type: [Schedule], default: () => []}
});

mongoose.model('Coach', CoachSchema);