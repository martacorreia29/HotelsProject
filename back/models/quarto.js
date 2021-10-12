var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var QuartoSchema = new Schema({
    // _id:     { type: String },
    number:     { type: Number, required: true, min: 1000, max: 9999 },
    reservas:   [ { type: Schema.ObjectId, ref: 'Reserva' } ]
});

module.exports = mongoose.model('Quarto', QuartoSchema);