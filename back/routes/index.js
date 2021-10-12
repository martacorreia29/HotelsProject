var express = require('express');
var router = express.Router();
// var url = require('../populatedb');

// Require our controllers.

var hotel_controller = require('../controllers/hotelController');
var tipo_de_quarto_controller = require('../controllers/tipoDeQuartoController');
var cliente_controller = require('../controllers/clienteController');
var authentication_controller = require('../controllers/authenticationController');
var reservas_controller = require('../controllers/reservasController');

// GET request for list of all Hotels. ?=> Also Homepage
router.get('/hoteis', hotel_controller.hotel_list);

// GET request for details of a Hotel.
router.get('/hotel/:id', hotel_controller.hotel_detail);

// GET request for detail of Room Type
router.get('/tipoDeQuarto/:id', tipo_de_quarto_controller.tipo_de_quarto_detail);

// GET request for Hotel Logo
router.get('/logo', function (req, res, next) {
	res.json('http://localhost:3066/images/Logo/logo.jpg');
	// res.json('http://appserver.alunos.di.fc.ul.pt:3066/images/Logo/logo.jpg');
});

router.post("/criar-reserva", reservas_controller.validar_dados);

// GET request for specific reservation
router.get('/reserva/:id', reservas_controller.reserva_detail);

// GET request for reservations of a specific user
router.get('/reservas/:id', cliente_controller.cliente_details);

// GET request to get Hotel of a specific Room Type
router.get('/hotel/tipoDeQuarto/:id', hotel_controller.hotel_by_tipo_de_quarto);

// GET request to get Room Type of a specific Room
router.get('/tipoDeQuarto/quarto/:id', tipo_de_quarto_controller.tipo_de_quarto_by_quarto);

//Login
router.post('/login', authentication_controller.login);

//Registar
router.post('/register', authentication_controller.register);

//nova reserva
router.post('/reserva-datas', reservas_controller.update_datas);

//novo cartao
router.post('/reserva-cartao', reservas_controller.update_cartao);

module.exports = router;
