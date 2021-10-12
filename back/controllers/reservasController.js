var Reserva = require('../models/reserva');
var Quarto = require('../models/quarto');
var Card = require('../models/card');
var Cliente = require('../models/cliente');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.reserva_detail = function (req, res, next) {
    Reserva.findById(req.params.id)
        .populate('hotel')
        .populate({
            path: 'tipodequarto',                   // populates list of tQuartos
            populate: [{
                path: 'quartos',                // populates list of tQuarto's Quartos
                populate: 'reservas'            // populates list of Quarto's Reservas
            }]
        })
        .populate('card')
        .exec(function (err, reserva) {
            if (err) {
                return next(err);
            }
            res.json(reserva);
        });
}

exports.validar_dados = [
    body('data.checkin').trim().custom(dataIn => {
        if (!dataIn.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
        const date = new Date(dataIn);
        if (!date.getTime()) return false;
        return date.toISOString().slice(0, 10) === dataIn;
    }).withMessage('Data de checkin inválida').trim().custom(dataVal => {
        const data = new Date(dataVal);
        return data > Date.now();
    }).withMessage('Data de checkin tem de ser no futuro'),

    body('data.checkout').trim().custom(dataOut => {
        if (!dataOut.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
        const date = new Date(dataOut);
        if (!date.getTime()) return false;
        return date.toISOString().slice(0, 10) === dataOut;
    }).withMessage('Data de checkout inválida').trim().custom(dataVal => {
        const data = new Date(dataVal);
        return data > Date.now();
    }).withMessage('Data de checkout tem de ser no futuro'),

    body('data.name').isLength({ min: 1 }).trim().withMessage('Nome não pode estar vazio.')
        .isAlphanumeric().withMessage('Nome so pode conter carateres alfanumericos.'),
    body('data.email').isEmail().withMessage('Email inválido'),
    body('data.phone').custom(phone => {
        var regex = /^(\+|00)(?:[0-9]?){6,14}[0-9]$/;
        return regex.test(phone);
    }).withMessage('Telefone inválido'),

    body('data.morada').isLength({ min: 1 }).trim().withMessage('Morada não pode estar vazia.'),
    body('data.nif').trim().custom(nif => {

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

    body("data.numeroCartaoCredito").trim().custom(value => {
        var acceptedCreditCards = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
            amex: /^3[47][0-9]{13}$/,
            discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
            diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/
        };

        // remove all non digit characters
        var value = value.replace(/\D/g, '');
        var sum = 0;
        var shouldDouble = false;
        // loop through values starting at the rightmost side
        for (var i = value.length - 1; i >= 0; i--) {
            var digit = parseInt(value.charAt(i));

            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        var valid = (sum % 10) == 0;
        var accepted = false;

        // loop through the keys (visa, mastercard, amex, etc.)
        Object.keys(acceptedCreditCards).forEach(function (key) {
            var regex = acceptedCreditCards[key];
            if (regex.test(value)) {
                accepted = true;
            }
        });

        return valid && accepted;
    }).withMessage("Numero de cartão de crédito inválido"),

    body('data.dataValidade').trim().custom(dataVal => {
        if (!dataVal.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
        const date = new Date(dataVal);
        if (!date.getTime()) return false;
        return date.toISOString().slice(0, 10) === dataVal;
    }).withMessage('Data de validade do cartão inválida').trim().custom(dataVal => {
        const data = new Date(dataVal);
        return data > Date.now();
    }).withMessage("Data de validade já expirou"),

    body('data.cvv').trim().custom(cvv => {
        return cvv.length == 4 || cvv.length == 3;
    }).withMessage("CVV inválido"),

    sanitizeBody('data.checkin').escape(),
    sanitizeBody('data.checkout').escape(),
    sanitizeBody('data.name').escape(),
    sanitizeBody('data.email').escape(),
    sanitizeBody('data.phone').escape(),
    sanitizeBody('data.morada').escape(),
    sanitizeBody('data.nif').escape(),
    sanitizeBody('data.numeroCartaoCredito').escape(),
    sanitizeBody('data.dataValidade').escape(),
    sanitizeBody('data.cvv').escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        var errors = validationResult(req);

        // Create client object with escaped and trimmed dat
        if (!errors.isEmpty()) {
            res.json({ 'success': false, 'message': errors.array() });
            return;
        }

        if (req.body.data.checkin >= req.body.data.checkout) {
            res.json({ 'success': false, 'message': [{ 'msg': "A data de checkin deve ser antes da de checkout!" }] });
            return;
        }


        // //Verificar se quarto ta disponivel
        if (req.body.data.tipoDeQuarto.quartos.length <= 0) {
            res.json({ 'success': false, 'message': [{ 'msg': "Este tipo de quarto não tem quartos!" }] });
            return;
        }

        var quartoParaReserva = null;
        var free = true;

        for (var quarto of req.body.data.tipoDeQuarto.quartos) {
            for (var reserva of quarto.reservas) {

                // If any Reserva occupies Quarto, then it's not free
                if (new Date(req.body.data.checkin).getTime() <= new Date(reserva.checkout).getTime()
                    && new Date(reserva.checkin).getTime() <= new Date(req.body.data.checkout).getTime()) {
                    free = false;
                    break;
                }

            }

            if (free) {
                quartoParaReserva = quarto;
                break;
            }

            free = true;
        }



        if (!free || quartoParaReserva == null) {
            res.json({ 'success': false, 'message': [{ 'msg': "Este tipo de quarto não tem quartos vagos para as datas dadas!" }] });
            return;
        }

        var cartao = new Card(
            {
                number: req.body.data.numeroCartaoCredito,
                cvv: req.body.data.cvv,
                date: req.body.data.dataValidade,

            }
        );

        var reserva = new Reserva(
            {
                name: req.body.data.name,
                email: req.body.data.email,
                nif: req.body.data.nif,
                address: req.body.data.morada,
                phone: req.body.data.phone,
                checkin: req.body.data.checkin,
                checkout: req.body.data.checkout,
                hotel: req.body.hotel,
                tipodequarto: req.body.data.tipoDeQuarto,
                quarto: quartoParaReserva,
                card: cartao,
                preco: req.body.preco
            }
        );

        Cliente.findByIdAndUpdate(req.body.cliente._id,
            { "$push": { "reservas": reserva } },
            { "new": true, "upsert": true },
            function (err, client) { if (err) throw err; console.log(client.name); }
        );

        Quarto.findByIdAndUpdate(quartoParaReserva._id,
            { "$push": { "reservas": reserva } },
            { "new": true, "upsert": true },
            function (err, quarto) { if (err) throw err; console.log(quarto.number); }
        );


        cartao.save(function (err) {
            if (err) { return next(err); }
        });

        reserva.save(function (err) {
            if (err) { return next(err); }
            res.json({ 'success': true, 'message': null });
        });
    }
];


exports.update_datas = [

    body('data.checkin').trim().custom(dataIn => {
        if (!dataIn.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
        const date = new Date(dataIn);
        if (!date.getTime()) return false;
        return date.toISOString().slice(0, 10) === dataIn;
    }).withMessage('Data de checkin inválida').trim().custom(dataVal => {
        const data = new Date(dataVal);
        return data > Date.now();
    }).withMessage('Data de checkin tem de ser no futuro'),

    body('data.checkout').trim().custom(dataOut => {
        if (!dataOut.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
        const date = new Date(dataOut);
        if (!date.getTime()) return false;
        return date.toISOString().slice(0, 10) === dataOut;
    }).withMessage('Data de checkout inválida').trim().custom(dataVal => {
        const data = new Date(dataVal);
        return data > Date.now();
    }).withMessage('Data de checkout tem de ser no futuro'),

    sanitizeBody('data.checkin').escape(),
    sanitizeBody('data.checkout').escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        var errors = validationResult(req);

        // Create client object with escaped and trimmed dat
        if (!errors.isEmpty()) {
            res.json({ 'success': false, 'message': errors.array() });
            return;
        }

        if (req.body.data.checkin >= req.body.data.checkout) {
            res.json({ 'success': false, 'message': [{ 'msg': "A data de checkin deve ser antes da de checkout!" }] });
            return;
        }

        if (new Date(req.body.data.checkin).getTime() == new Date(req.body.reserva.checkin).getTime()
            && new Date(req.body.data.checkout).getTime() == new Date(req.body.reserva.checkout).getTime()) {
            res.json({ 'success': false, 'message': [{ 'msg': "Escolha datas diferentes das atuais!" }] });
            return;
        }

        // //Verificar se quarto ta disponivel
        if (req.body.reserva.tipodequarto.quartos.length <= 0) {
            res.json({ 'success': false, 'message': [{ 'msg': "Este tipo de quarto não tem quartos!" }] });
            return;
        }
        var quartoParaReserva = null;
        var free = true;

        for (var quarto of req.body.reserva.tipodequarto.quartos) {
            for (var reserva of quarto.reservas) {

                // If any Reserva occupies Quarto, then it's not free
                if ((new Date(req.body.data.checkin).getTime() <= new Date(reserva.checkout).getTime()
                    && new Date(reserva.checkin).getTime() <= new Date(req.body.data.checkout).getTime()) && reserva._id != req.body.reserva._id) {
                    free = false;
                    break;
                }

            }

            if (free) {
                quartoParaReserva = quarto;
                break;
            }

            free = true;
        }


        if (!free || quartoParaReserva == null) {
            res.json({ 'success': false, 'message': [{ 'msg': "Este tipo de quarto não tem quartos vagos para as datas dadas!" }] });
            return;
        }

        Reserva.findByIdAndUpdate(req.body.reserva._id,
            { "checkin": req.body.data.checkin, "checkout": req.body.data.checkout, "preco": req.body.preco, "quarto": quartoParaReserva },
            function (err, reservaUpdated) {
                if (err) throw err;
                if (quartoParaReserva._id != req.body.reserva.quarto) {
                    Quarto.findByIdAndUpdate(req.body.reserva.quarto,
                        { "$pull": { "reservas": reservaUpdated._id } }, { safe: true, upsert: true },
                        function (err, quarto) { if (err) throw err; console.log(quarto); }
                    );

                    Quarto.findByIdAndUpdate(quartoParaReserva._id,
                        { "$push": { "reservas": reservaUpdated } },
                        { "new": true, "upsert": true },
                        function (err, quarto) { if (err) throw err; console.log("1" + quarto.number); }
                    );
                }

                res.json({ 'success': true, 'message': null });
            }
        );


    }

];

exports.update_cartao = [

    body("data.numeroCartaoCredito").trim().custom(value => {
        var acceptedCreditCards = {
            visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
            amex: /^3[47][0-9]{13}$/,
            discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/,
            diners_club: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/
        };

        // remove all non digit characters
        var value = value.replace(/\D/g, '');
        var sum = 0;
        var shouldDouble = false;
        // loop through values starting at the rightmost side
        for (var i = value.length - 1; i >= 0; i--) {
            var digit = parseInt(value.charAt(i));

            if (shouldDouble) {
                if ((digit *= 2) > 9) digit -= 9;
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        var valid = (sum % 10) == 0;
        var accepted = false;

        // loop through the keys (visa, mastercard, amex, etc.)
        Object.keys(acceptedCreditCards).forEach(function (key) {
            var regex = acceptedCreditCards[key];
            if (regex.test(value)) {
                accepted = true;
            }
        });

        return valid && accepted;
    }).withMessage("Numero de cartão de crédito inválido"),

    body('data.dataValidade').trim().custom(dataVal => {
        if (!dataVal.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
        const date = new Date(dataVal);
        if (!date.getTime()) return false;
        return date.toISOString().slice(0, 10) === dataVal;
    }).withMessage('Data de validade do cartão inválida').trim().custom(dataVal => {
        const data = new Date(dataVal);
        return data > Date.now();
    }).withMessage("Data de validade já expirou"),

    body('data.cvv').trim().custom(cvv => {
        return cvv.length == 4 || cvv.length == 3;
    }).withMessage("CVV inválido"),

    sanitizeBody('data.numeroCartaoCredito').escape(),
    sanitizeBody('data.dataValidade').escape(),
    sanitizeBody('data.cvv').escape(),

    (req, res, next) => {

        // Extract the validation errors from a request.
        var errors = validationResult(req);

        // Create client object with escaped and trimmed dat
        if (!errors.isEmpty()) {
            res.json({ 'success': false, 'message': errors.array() });
            return;
        }

        var cartao = new Card(
            {
                number: req.body.data.numeroCartaoCredito,
                cvv: req.body.data.cvv,
                date: req.body.data.dataValidade,

            }
        );

        if (req.body.reserva.card.number == cartao.number && req.body.reserva.card.cvv == cartao.cvv
            && req.body.reserva.card.date == cartao.date) {
            res.json({ 'success': true, 'message': null });
        } else {
            Reserva.findByIdAndUpdate(req.body.reserva._id,
                { "card": cartao },
                function (err, reserva) { if (err) throw err; res.json({ 'success': true, 'message': null }); }
            );

            cartao.save(function (err) {
                if (err) { return next(err); }
            });
        }

    }

];