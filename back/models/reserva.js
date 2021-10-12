var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReservaSchema = new Schema({
    // _id:         { type: String },
    // cliente:     { type: Schema.ObjectId, ref: 'Cliente', required: true },
    name: { type: String, required: true, max: 100 },
    email: { type: String, required: true, max: 100 },
    phone: { type: String, required: true, min: 9, max: 18 },
    address: { type: String, required: true, max: 100 },
    nif: { type: Number, required: true, min: 100000000, max: 999999999 },
    hotel: { type: Schema.ObjectId, ref: 'Hotel' },
    tipodequarto: { type: Schema.ObjectId, ref: 'TipoDeQuarto' },
    quarto: { type: Schema.ObjectId, ref: 'Quarto' },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    card: { type: Schema.ObjectId, ref: 'Card', required: true },
    preco: { type: Number, required: true }
});

module.exports = mongoose.model('Reserva', ReservaSchema);