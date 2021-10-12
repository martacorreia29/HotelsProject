var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentCardSchema = new Schema({
    number: { type: String , required: true, min: 16, max: 16 },
    cvv:    { type: Number,  required: true, min: 100, max: 999},
    date:   { type: Date, required: true}
});

module.exports = mongoose.model('Card', PaymentCardSchema);