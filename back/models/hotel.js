var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var HotelSchema = new Schema({
    name:       { type: String, required: true, max: 100 },
    desc:       { type: String, required: true, max: 2000 },
    email:      { type: String, required: true, max: 100 },
    phone:      { type: String, required: true, min: 9, max: 18 },
    address:    { type: String, required: true, max: 100 },
    gps:        { type: String, required: true },
    photo_path: [ { type: String, required: true } ],
    servicos:   [ { type: Schema.ObjectId, ref: 'Servico'} ],
    tQuartos:   [ { type: Schema.ObjectId, ref: 'TipoDeQuarto' } ],
});

module.exports = mongoose.model('Hotel', HotelSchema);