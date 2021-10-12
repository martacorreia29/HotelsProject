var Reserva = require('../models/reserva');
var Quarto = require('../models/quarto');
var Card = require('../models/card');
var Cliente = require('../models/cliente');
var async = require('async');

/**
 * Lista de reservas de um determinado cliente <- pode nem ser necessario 
 * pq o Cliente tem lista de reservas 
 */
exports.cliente_details = function(req, res, next) {
	Cliente.findById(req.params.id)
	.populate({
		path: 'reservas',                   // populates list of Reservas
		populate: [{ path: 'quarto'         // populates list of Reserva's Quarto
		}, { path: 'card'                // populates list of Reserva's Card
		}, { path: 'tipodequarto'
		}, { path: 'hotel'}]
	})
	.exec(function(err, cliente) {
	if (err) {
		return next(err);
	}
	res.json(cliente);
	});
};