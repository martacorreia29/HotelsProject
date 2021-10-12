var Hotel = require('../models/hotel');
var Servico = require('../models/servico');
var TipoDeQuarto = require('../models/tipo-de-quarto');
var async = require('async');

/**
 * Lista dos hoteis presentes no sistema
 */
exports.hotel_list = function (req, res, next) {
	Hotel.find().sort([['name', 'ascending']]).exec(function (err, list_hotel) {
		if (err) {
			return next(err);
		}
		// responds with hotel list
		res.json(list_hotel);
	});
};

// Display detail page for a specific Hotel.
exports.hotel_detail = function (req, res, next) {
	Hotel.findById(req.params.id)
		.populate({
			path: 'servicos',                   // populates list of Servicos
			options: { sort: { name: 1 } }      // Sorts that list by Servico's name, 1 for ASC
		})
		.populate({
			path: 'tQuartos',                   // populates list of tQuartos
			populate: [{
				path: 'servicos',               // populates list of tQuarto's Servicos
				options: { sort: { name: 1 } }  // Sorts that list by Servico's name, 1 for ASC
			}, {
				path: 'quartos',                // populates list of tQuarto's Quartos
				populate: 'reservas'            // populates list of Quarto's Reservas
			}]
		})
		.exec(function (err, hotel) {
			if (err) {
				return next(err);
			} // Error in API usage.
			if (hotel == null) {
				// No results.
				var err = new Error('Hotel not found');
				err.status = 404;
				return next(err);
			}
			// responds sending completely populated hotel
			res.json(hotel);
		});
};

//Gets Hotel with a specific Tipo de Quarto 
exports.hotel_by_tipo_de_quarto = function (req, res, next) {
	Hotel.find({ 'tQuartos': req.params.id })
		.exec(function (err, hotel) {
			if (err) { return next(err); }
			res.json(hotel[0]);
		})
}
