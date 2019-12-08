const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = exports.TransactionSchema = new Schema({
    _stripeId: {type: String, required: true},
    stripe_amount: {type: Number, required: true},
    stripe_currency: {type: String, required: true},
    description: {type: String, required: true},
    stripe_status: {type: String, required: true},
    _userId: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},
    _coachId: {type: Schema.Types.ObjectId, ref: 'UserAccount', required: true},
    stripe_created: {type: Number, required: true},
    creationDate: {type: Date, default: Date.now()}
});

mongoose.model('Transaction', TransactionSchema);
