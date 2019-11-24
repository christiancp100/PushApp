const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Certificate = new Certificate ({
    //to discuss
});

const Fee = new Schema ({
    price: {type: Number, required: true},
    period: {type: Number, required: true}
});

const Rating = new Schema ({
    score: {type: Number},
    text: {type: String},
    date: {type: Date, default: Date.now()},
});

const Exercise = new Schema ({
    name: {type: String, required: true},
    //to discuss
    //some other stuff retrieved from the API
});

const TrainingSession = new Schema ({
    exercise: [Exercise],
    startTime: {type: Number, required: true},
    endTime: {type: Number, required: true}
});


const Schedule = new Schema ({
    duration: {type: Number, required: true},
    trainingSession: [TrainingSession],
});

const CoachesSchema = exports.CoachesSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    description: {type: String},
    photo: {type: String},
    birthday: {type: String, required: true},
    sex: {type: String, required: true},
    contactInfo: {
        email: {type: String, required: true},
        phone: {type: String},
        address1: {type: String},
        address2: {type: String},
        city: {type: String, required: true},
        state: {type: String, required: true},
        zipCode: {type: String, required: true},
        country: {type: String, required: true},
        certificate: [Certificate]
    },
    offer: [Fee],
    rating: [Rating],
    currency: {type: String},
    //to discuss
    // localization: {type: String},
    schedule: [Schedule]
});

mongoose.model('CoachesSchema', CoachesSchema);