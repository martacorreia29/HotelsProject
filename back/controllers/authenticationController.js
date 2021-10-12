var Cliente = require('../models/cliente');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

/**
 * Lista dos hoteis presentes no sistema
 */
exports.login = function (req, res, next) {
	Cliente.findOne({ username: req.body.username, password: req.body.password }, function (err, cliente) {
		if (err) {
			return next(err);
		}

		res.json(cliente);
	});
};

exports.register = [
	body('name').isLength({ min: 1 }).trim().withMessage('Nome não pode estar vazio.')
		.isAlphanumeric().withMessage('Nome so pode conter carateres alfanumericos.'),
	body('email').isEmail().withMessage('Email inválido'),
	body('phone').custom(phone => {
		var regex = /^(\+|00)(?:[0-9]?){6,14}[0-9]$/;
		return regex.test(phone);
	}).withMessage('Telefone inválido, verifique se pos o indicativo'),
	body('address').isLength({ min: 1 }).trim().withMessage('Morada não pode estar vazia.'),
	body('nif').custom(nif => {
		if (nif.length == 9) {
			added = ((nif[7] * 2) + (nif[6] * 3) + (nif[5] * 4) + (nif[4] * 5) + (nif[3] * 6) + (nif[2] * 7) + (nif[1] * 8) + (nif[0] * 9));
			mod = added % 11;
			if (mod == 0 || mod == 1) {
				control = 0;
			} else {
				control = 11 - mod;
			}

			if (nif[8] == control) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}).withMessage("NIF inválido"),
	body('username').isLength({ min: 1 }).trim().withMessage('Username nao pode estar vazio.')
		.isAlphanumeric().withMessage('Username so pode conter carateres alfanumericos'),
	body('password').isLength({ min: 1 }).trim().withMessage('Password nao deve estar vazia.')
		.isAlphanumeric().withMessage('Password so pode conter carateres alfanumericos.'),

	sanitizeBody('name').escape(),
	sanitizeBody('email').escape(),
	sanitizeBody('phone').escape(),
	sanitizeBody('address').escape(),
	sanitizeBody('nif').escape(),
	sanitizeBody('username').escape(),
	sanitizeBody('password').escape(),


	(req, res, next) => {
		// Extract the validation errors from a request.
		var errors = validationResult(req);

		// Create client object with escaped and trimmed data
		var cliente = new Cliente(
			{
				name: req.body.name,
				nif: req.body.nif,
				address: req.body.address,
				phone: req.body.phone,
				email: req.body.email,
				username: req.body.username,
				password: req.body.password
			}
		);

		if (!errors.isEmpty()) {
			res.json({ cliente: null, message: errors.array() });
			return;
		}
		else {
			cliente.save(function (err) {
				if (err) { return next(err); }
				res.json({ 'cliente': cliente, 'message': null });
			});
		}
	}
];
