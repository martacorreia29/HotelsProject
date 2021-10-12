var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TipoDeQuartoSchema = new Schema({
    // _id:         { type: String },
    name:           { type: String, required: true, max: 100 },
    lowPrice:       { type: Number, min: 0 },
    highPrice:      { type: Number, min: 0 },
    servicos:       [ { type: Schema.ObjectId, ref: 'Servico' } ],
    quartos:        [ { type: Schema.ObjectId, ref: 'Quarto' } ]
});

module.exports = mongoose.model('TipoDeQuarto', TipoDeQuartoSchema);