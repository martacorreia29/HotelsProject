var TipoDeQuarto = require('../models/tipo-de-quarto')
var Servico = require('../models/servico');
var Quarto = require('../models/quarto');
var Reserva = require('../models/reserva');

var async = require('async')

exports.tipo_de_quarto_detail = function (req, res, next) {
    TipoDeQuarto.findById(req.params.id)
        .populate({
            path: 'servicos',                   // populates list of Servicos
            options: { sort: { name: 1 } }      // Sorts that list by Servicos name
        })
        .populate({
            path: 'quartos',                    // populates list of Quartos
            options: { sort: { number: 1 } },    // Sorts that list by Quartos number
            populate: {
                path: 'reservas',
                options: { sort: { checkin: 1, checkout: 1 } }
            }
        })
        .exec(function (err, tQuarto) {
            if (err) { return next(err); }                      // Error in API usage.
            if (tQuarto == null) {                              // No results.
                var err = new Error('Room type not found');
                err.status = 404;
                return next(err);
            }

            res.json(tQuarto);
        });
}

//Gets Tipo de Quarto with a specific Quarto
exports.tipo_de_quarto_by_quarto = function(req, res, next) {
	TipoDeQuarto.find({ 'quartos': req.params.id })
		.exec(function (err, tipoDeQuarto) {
            if (err) { return next(err); }
			res.json(tipoDeQuarto[0]);
		})
}