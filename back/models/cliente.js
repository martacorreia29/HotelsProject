var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ClienteSchema = new Schema({
	// _id:         { type: String },
	name: { type: String, required: true, max: 100 },
	email: { type: String, required: true, max: 100 },
	phone: { type: String, required: true, min: 9, max: 18 },
	address: { type: String, required: true, max: 100 },
	nif: { type: Number, required: true, min: 100000000, max: 999999999 },
	username: { type: String, required: true, max: 100 },
	password: { type: String, required: true, min: 6, max: 100 },
	reservas: [{ type: Schema.ObjectId, ref: 'Reserva' }]
});

module.exports = mongoose.model('Cliente', ClienteSchema);
