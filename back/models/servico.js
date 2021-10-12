var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ServicoSchema = new Schema({
    // _id:         { type: String },
    name:           { type: String, required: true, max: 100 },
});

module.exports = mongoose.model('Servico', ServicoSchema);