// RUN
// node populatedb

var async = require('async');

var Hotel = require('./models/hotel');
var Quarto = require('./models/quarto');
var Reserva = require('./models/reserva')
var Card = require('./models/card');
var Servico = require('./models/servico');
var TipoDeQuarto = require('./models/tipo-de-quarto');
var Cliente = require('./models/cliente');

var mongoose = require('mongoose');

// Our MongoDB
var mongoDB = 'mongodb+srv://fc51033:sporting@tutorial-2iujo.azure.mongodb.net/HoteisPSI?retryWrites=true&w=majority';

// Uni MongoDB inside VPN
// var mongoDB = 'mongodb://psi016:psi016@localhost:27017/psi016?retryWrites=true&authSource=psi016';

// Uni MongoDB outside VPN
// var mongoDB = '?';

mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Cleans MongoDB
db.dropDatabase();

var hoteis = [];
var quartos = [];
var reservas = []
var cards = [];
var servicosQuarto = [];
var servicosHotel = [];
var tiposDeQuarto = [];
var clientes = [];

function hotelCreate(name, desc, email, phone, address, gps, photo_path, servicos, tQuartos, cb) {
    var hotel = new Hotel({
        name: name,
        desc: desc,
        email: email,
        phone: phone,
        address: address,
        gps: gps,
        photo_path: photo_path,
        servicos: servicos,
        tQuartos: tQuartos
    });

    hotel.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Hotel: ' + hotel);
        hoteis.push(hotel);
        cb(null, hotel);
    });
}

function quartoCreate(number, reservas, cb) {
    var quarto = new Quarto({
        number: number,
        reservas: reservas
    });

    quarto.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }
        console.log('New Quarto: ' + quarto);
        quartos.push(quarto);
        if (quarto.number == 1427) cb(null, quarto);
    });
}

function servicoQuartoCreate(name, cb) {
    var servico = new Servico({
        name: name
    });

    servico.save(function (err) {
        if (err) {
            console.log('ERROR CREATING servico: ' + servico);
            cb(err, null);
            return;
        }
        console.log('New servico: ' + servico);
        servicosQuarto.push(servico);
        cb(null, servico);
    });
}

function servicoHotelCreate(name, cb) {
    var servico = new Servico({
        name: name
    });

    servico.save(function (err) {
        if (err) {
            console.log('ERROR CREATING servico: ' + servico);
            cb(err, null);
            return;
        }
        console.log('New servico: ' + servico);
        servicosHotel.push(servico);
        cb(null, servico);
    });
}

function tipoDeQuartoCreate(name, lowPrice, highPrice, servicos, quartos, cb) {
    var tipoDeQuarto = new TipoDeQuarto({
        name: name,
        lowPrice: lowPrice,
        highPrice: highPrice,
        servicos: servicos,
        quartos: quartos
    });

    tipoDeQuarto.save(function (err) {
        if (err) {
            console.log('ERROR CREATING tipoDeQuarto: ' + tipoDeQuarto);
            cb(err, null);
            return;
        }
        console.log('New tipoDeQuarto: ' + tipoDeQuarto);
        tiposDeQuarto.push(tipoDeQuarto);
        cb(null, tipoDeQuarto);
    });
}

function reservaCreate(name, nif, email, address, phone, hotel, tipodequarto, checkin, checkout, card, cb) {

    var reserva = new Reserva({
        name: name,
        email: email,
        nif: nif,
        address: address,
        phone: phone,
        hotel: hotel,
        tipodequarto: tipodequarto,
        checkin: checkin,
        checkout: checkout,
        card: card
    });

    reserva.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }

        console.log('New Reserva: ' + reserva);
        reservas.push(reserva)
        cb(null, reserva)
    });
}

function cardCreate(number, cvv, date, cb) {
    console.log("-> NUMBER:" + number);
    var card = new Card({
        number: number,
        cvv: cvv,
        date: date
    });

    card.save(function (err) {
        if (err) {
            console.log('ERROR CREATING card: ' + card);
            cb(err, null);
            return;
        }
        console.log('New card: ' + card);
        cards.push(card);
        cb(null, card);
    });
}

function clienteCreate(name, email, quartos, address, nif, username, password, reservas, cb) {
    var cliente = new Cliente({
        name: name,
        email: email,
        phone: quartos,
        address: address,
        nif: nif,
        username: username,
        password: password,
        reservas: reservas
    });

    cliente.save(function (err) {
        if (err) {
            console.log('ERROR CREATING cliente: ' + cliente);
            cb(err, null);
            return;
        }
        console.log('New cliente: ' + cliente);
        clientes.push(cliente);
        cb(null, cliente);
    });
}

function createServicosQuarto(cb) {
    async.series(
        [
            function (callback) {
                servicoQuartoCreate('Telefone', callback);
            },
            function (callback) {
                servicoQuartoCreate('Wi-Fi gratuito', callback);
            },
            function (callback) {
                servicoQuartoCreate('Ar condicionado', callback);
            },
            function (callback) {
                servicoQuartoCreate('Casa de Banho privativa com Telefone', callback);
            },
            function (callback) {
                servicoQuartoCreate('Máquina de café', callback);
            },
            function (callback) {
                servicoQuartoCreate('Televisão LED', callback);
            },
            function (callback) {
                servicoQuartoCreate('Canais por Cabo', callback);
            },
            function (callback) {
                servicoQuartoCreate('Mini-bar', callback);
            },
            function (callback) {
                servicoQuartoCreate('Cofre', callback);
            },
            function (callback) {
                servicoQuartoCreate('Secador de Cabelo', callback);
            },
            function (callback) {
                servicoQuartoCreate('Espelho de Maquilhagem', callback);
            },
            function (callback) {
                servicoQuartoCreate('Produtos da Higiene Pessoal Gratuito', callback);
            },
            function (callback) {
                servicoQuartoCreate('Fechadura Eletrónica de Segurança', callback);
            },
            function (callback) {
                servicoQuartoCreate('Roupão e Chinelos', callback);
            },
            function (callback) {
                servicoQuartoCreate('Sala de Estar', callback);
            },
            function (callback) {
                servicoQuartoCreate('Servico de Quarto 24h', callback);
            },
            function (callback) {
                servicoQuartoCreate('Chaleira', callback);
            },
            function (callback) {
                servicoQuartoCreate('Varanda', callback);
            },
            function (callback) {
                servicoQuartoCreate('Frigorífico', callback);
            },
            function (callback) {
                servicoQuartoCreate('Kitchnette', callback);
            },
            function (callback) {
                servicoQuartoCreate('Microondas', callback);
            },
            function (callback) {
                servicoQuartoCreate('Sofá-cama', callback);
            },
            function (callback) {
                servicoQuartoCreate('Televisão LCD', callback);
            }
        ],
        // optional callback
        cb
    );
}

function createServicosHotel(cb) {
    async.series(
        [
            function (callback) {
                servicoHotelCreate('Adega Moreira', callback); //1
            },
            function (callback) {
                servicoHotelCreate('Acesso Gratuito à Internet via Wi-Fi', callback); //2
            },
            function (callback) {
                servicoHotelCreate('Serviço de Lavandaria', callback); //3
            },
            function (callback) {
                servicoHotelCreate('Acessos para pessoas de mobilidade reduzida', callback); //3
            },
            function (callback) {
                servicoHotelCreate('Receção 24h', callback); //4
            },
            function (callback) {
                servicoHotelCreate('Biblioteca', callback); //5
            },
            function (callback) {
                servicoHotelCreate('Jardins e Espaços Exteriores', callback); //6
            },
            function (callback) {
                servicoHotelCreate('Piscina exterior para Adultos e Criança', callback); //7
            },
            function (callback) {
                servicoHotelCreate('Parque de Estacionamento', callback); //8
            },
            function (callback) {
                servicoHotelCreate('Nep Kids Club', callback); //9
            },
            function (callback) {
                servicoHotelCreate('Parque Infantil', callback); //10
            },
            function (callback) {
                servicoHotelCreate('Sala de Jogos', callback); //11
            },
            function (callback) {
                servicoHotelCreate('Clube de Saúde', callback); //12
            },
            function (callback) {
                servicoHotelCreate('Lojas', callback); //13
            }
        ],
        // optional callback
        cb
    );
}

function createReservas(cb) {
    async.series([
        function (callback) {
            reservaCreate(
                "jorge",
                242091237,
                "lmao@lmao.com",
                "confidencial",
                "(+351)768596879",
                hoteis[0],
                tiposDeQuarto[0],
                new Date("2016-05-18"),
                new Date("2016-05-24"),
                cards[0],
                callback
            );
        },
        function (callback) {
            reservaCreate(
                "jorge",
                242091237,
                "lmao@lmao.com",
                "confidencial",
                "(+351)768596879",
                hoteis[0],
                tiposDeQuarto[0],
                new Date("2021-06-10"),
                new Date("2021-06-16"),
                cards[1],
                callback
            );
        },
    ],
        // Optional callback
        cb
    );
}

function createCard(cb) {
    async.series([
        function (callback) {
            cardCreate(
                '0000000000000001',
                111,
                new Date("2016-05-24"),
                callback
            );
        },
        function (callback) {
            cardCreate(
                '0000000000000002',
                222,
                new Date("2016-05-24"),
                callback
            );
        },
    ],
        // Optional callback
        cb
    );
}

function createCliente(cb) {
    async.series([
        function (callback) {
            clienteCreate(
                'Jorge',
                'jorge@jorge.come',
                '+351969969969',
                'Jorge do Jorge, numero Jorge',
                221592520,
                "jorge",
                "jorge",
                [],
                callback
            );
        },
        function (callback) {
            clienteCreate(
                'teste',
                'teste@teste.come',
                '+351912345678',
                'Rua da Drena Máxima, numero 420',
                257524606,
                "teste",
                "teste",
                [],
                callback
            );
        },
        function (callback) {
            clienteCreate(
                'tina',
                'tina@tina.come',
                '+351912345678',
                'Rua da TINA, numero raiz de -1',
                257524606,
                "tina",
                "tina",
                [],
                callback
            );
        }
    ],
        // optional callback
        cb
    );
}

function createQuartos(cb) {
    async.series(
        [
            function (callback) {
                // quartoCreate(1000, [], callback); //0
                // quartoCreate(1001, [], callback); //1
                for (var i = 1000; i < 1428; i++) quartoCreate(i, [], callback);
            }
        ],
        // Optional callback
        cb
    );
}

function createTipoDeQuarto(cb) {
    async.series(
        [
            // Hotel 1
            function (callback) {
                tipoDeQuartoCreate(
                    'Quarto Standart',
                    180,
                    270,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[5],
                        servicosQuarto[6],
                        servicosQuarto[7],
                        servicosQuarto[8],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[10],
                        servicosQuarto[11],
                        servicosQuarto[12],
                        servicosQuarto[13],
                        servicosQuarto[4]
                    ],
                    quartos.slice(0, 3),
                    callback
                );
            },
            function (callback) {
                tipoDeQuartoCreate(
                    'Suite',
                    250,
                    330,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[5],
                        servicosQuarto[6],
                        servicosQuarto[8],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[10],
                        servicosQuarto[11],
                        servicosQuarto[12],
                        servicosQuarto[14],
                        servicosQuarto[13],
                        servicosQuarto[4]
                    ],
                    quartos.slice(3, 4),
                    callback
                );
            },
            function (callback) {
                tipoDeQuartoCreate(
                    'Suite Duplex',
                    270,
                    350,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[5],
                        servicosQuarto[6],
                        servicosQuarto[8],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[10],
                        servicosQuarto[11],
                        servicosQuarto[15],
                        servicosQuarto[12],
                        servicosQuarto[14],
                        servicosQuarto[13],
                        servicosQuarto[4]
                    ],
                    quartos.slice(4, 5),
                    callback
                );
            },
            function (callback) {
                tipoDeQuartoCreate(
                    'Suite Deluxe',
                    310,
                    450,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[5],
                        servicosQuarto[6],
                        servicosQuarto[8],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[10],
                        servicosQuarto[11],
                        servicosQuarto[15],
                        servicosQuarto[12],
                        servicosQuarto[14],
                        servicosQuarto[13],
                        servicosQuarto[4]
                    ],
                    quartos.slice(5, 6),
                    callback
                );
            },
            // Hotel 2
            function (callback) {
                tipoDeQuartoCreate(
                    'Quarto Standart',
                    90,
                    160,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[22],
                        servicosQuarto[6],
                        servicosQuarto[7],
                        servicosQuarto[8],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[11],
                        servicosQuarto[12],
                        servicosQuarto[15],
                        servicosQuarto[16]
                    ],
                    quartos.slice(6, 188),
                    callback
                );
            },
            function (callback) {
                tipoDeQuartoCreate(
                    'Suite Júnior',
                    120,
                    180,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[22],
                        servicosQuarto[6],
                        servicosQuarto[7],
                        servicosQuarto[8],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[11],
                        servicosQuarto[12],
                        servicosQuarto[15],
                        servicosQuarto[14],
                        servicosQuarto[16]
                    ],
                    quartos.slice(188, 193),
                    callback
                );
            },
            function (callback) {
                tipoDeQuartoCreate(
                    'Suite Júnior Superior',
                    130,
                    210,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[22],
                        servicosQuarto[6],
                        servicosQuarto[8],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[11],
                        servicosQuarto[12],
                        servicosQuarto[15],
                        servicosQuarto[14],
                        servicosQuarto[17],
                        servicosQuarto[16]
                    ],
                    quartos.slice(193, 208),
                    callback
                );
            },
            // Hotel 3
            function (callback) {
                tipoDeQuartoCreate(
                    'Quarto Standart',
                    70,
                    210,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[22],
                        servicosQuarto[6],
                        servicosQuarto[8],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[10],
                        servicosQuarto[11],
                        servicosQuarto[19],
                        servicosQuarto[12],
                        servicosQuarto[15],
                        servicosQuarto[18],
                        servicosQuarto[20],
                        servicosQuarto[16]
                    ],
                    quartos.slice(208, 322),
                    callback
                );
            },
            function (callback) {
                tipoDeQuartoCreate(
                    'Suite Júnior',
                    90,
                    250,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[22],
                        servicosQuarto[6],
                        servicosQuarto[8],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[10],
                        servicosQuarto[11],
                        servicosQuarto[19],
                        servicosQuarto[12],
                        servicosQuarto[15],
                        servicosQuarto[17],
                        servicosQuarto[18],
                        servicosQuarto[14],
                        servicosQuarto[20],
                        servicosQuarto[16]
                    ],
                    quartos.slice(322, 420),
                    callback
                );
            },
            function (callback) {
                tipoDeQuartoCreate(
                    'Suite Sénior',
                    120,
                    240,
                    [
                        servicosQuarto[0],
                        servicosQuarto[1],
                        servicosQuarto[2],
                        servicosQuarto[22],
                        servicosQuarto[8],
                        servicosQuarto[6],
                        servicosQuarto[3],
                        servicosQuarto[9],
                        servicosQuarto[10],
                        servicosQuarto[11],
                        servicosQuarto[19],
                        servicosQuarto[12],
                        servicosQuarto[15],
                        servicosQuarto[14],
                        servicosQuarto[21],
                        servicosQuarto[17],
                        servicosQuarto[18],
                        servicosQuarto[20],
                        servicosQuarto[16]
                    ],
                    quartos.slice(420, 428),
                    callback
                );
            }
        ],
        // Optional callback
        cb
    );
}

var desc1 =
    'Com uma vista de cortar o fôlego para o Rio Douro e para o Rio Tedo, é no coração do \
Douro Vinhateiro que surge o Hotel Douro Vinhas. Com uma forte componente de agro e \
enoturismo, esta unidade estende-se pela centenária Quinta do Moreira. \
Na margem sul do Douro, perto da pitoresca aldeia do Marmelal, a propriedade que acolhe \
o Hotel Douro Vinhas fica muito próxima de um dos dois marcos mandados construir pelo \
Marquês de Pombal em 1757. Classificados como imóveis de interesse público, serviam para \
demarcar a zona dos vinhos generosos do Douro, à época sob jurisdição da Companhia \
Geral da Agricultura das Vinhas Douro. Nascia assim a primeira região demarcada de vinhos \
do mundo. Hoje, os vinhedos em socalcos tornam única a paisagem que rodeia esta \
unidade. \
Numa primeira fase com apenas sete quartos, o Hotel Douro Vinhas distingue-se pela \
localização, pelo charme e pela exclusividade. Aqui poderá desfrutar da calma e do silêncio, \
do cenário, mas também a piscina exterior, da gastronomia regional do restaurante \
Moreira, cujos grandes janelões permitem admirar a envolvente. Mas também das visitas à \
adega e provas de vinhos do Porto, produzidos no local. \
Poderá ainda aproveitar para passear entre as vinhas, pelo olival ou pelo amendoal \
(particularmente bonito durante as amendoeiras em flor), sempre com o Tedo e o Douro \
como companhia. Para completar a estadia, faça um cruzeiro fluvial, visite as quintas \
vinícolas da região ou faça um passeio de comboio. Ver as amendoeiras em flor ou \
participar nas vindimas são outras sugestões.';

var desc2 =
    'Situado na pitoresca vila da Ericeira, mesmo em cima da praia, este hotel com história e \
tradição, que resulta da reabilitação do marcante Hotel de Turismo da Ericeira, tem como \
cenário o Oceano Atlântico. \
A 30 minutos de Lisboa, com acesso direto por autoestrada, o hotel A Ver o Mar dispõe de \
quatro tipologias de quarto, destacando-se os que têm varanda e vista para o mar. Este \
hotel na Ericeira inclui um restaurante, dois bares, salas para eventos e reuniões \
empresariais, clube de crianças e parque infantil e um moderno clube de saúde com salas \
de massagens, jacuzzi, sauna, banho turco e ginásio. \
Durante a sua estadia no hotel A Ver o Mar, não deixe de dar um mergulho nas duas \
piscinas para adultos, uma das quais de água salgada. Já as crianças vão adorar os \
escorregas aquáticos. \
Partindo deste hotel na Ericeira, aventure-se a conhecer as praias da região. E saiba que se \
apreciar desportos de ondas, está em plena reserva mundial de surf, e palco de uma das \
etapas do circuito WSL World Tour que junta os melhores surfistas do mundo. Pode ainda \
visitar o Palácio Nacional de Mafra ou Sintra, a 20 minutos de distância do hotel A Ver o \
Mar, de carro. \
No verão, a animação da vila aumenta graças a vários festivais, entre os quais um dedicado \
exclusivamente à música reggae.';

var desc3 =
    'Encontrará o Hotel Mediterrâneo mesmo junto à praia e apenas a cinco minutos do centro \
de Albufeira, no Algarve. \
Este hotel em Albufeira oferece quartos modernos e amplos, dos quais se destacam os com \
vista para o mar ou as suítes. Todos têm kitchenette, sendo ideais para famílias com \
crianças. \
Conta ainda com um bar, um restaurante com buffet internacional e piscinas exteriores para \
adultos e crianças, prometendo dias de muito sol e animação. Tem ainda uma sala de jogos, \
parque infantil, clube de crianças com atividades para os mais novos e animadores próprios, \
spa com piscina interior, banho turco e jacuzzi, salas de massagem, ginásio e wi-fi gratuito \
em todas as zonas. \
Durante a sua estadia aproveite para conhecer as irresistíveis praias de Albufeira, aventurar- \
se em desportos náuticos ou desfrutar das animadas ruas da cidade, repletas de bares, \
restaurantes e comércio, ou passear na marina. \
Pode também visitar diferentes parques temáticos como o Zoomarine, Aqualand e \
Aquashow.';

// url
var url = 'localhost:3066';

// VPN url
//var url = 'appserver.alunos.di.fc.ul.pt:3066';

var hotel1 = url + '/images/Hotel1/hotel1-';
var hotel2 = url + '/images/Hotel2/hotel2-';
var hotel3 = url + '/images/Hotel3/hotel3-';

function createHoteis(cb) {
    async.series(
        [
            // Hotel 1
            function (callback) {
                hotelCreate(
                    'Douro Vinhas',
                    desc1,
                    'dourovinhas@hoteispsi.com',
                    '(+351) 254 249 000',
                    'Hotel Douro Vinhas\nQuinta do Moreira – Marmelal\n5110-672 Armamar\nPortugal',
                    '41°09\'26.0"N 7°38\'26.0"W',
                    [
                        hotel1 + '1.jpg',
                        hotel1 + '2.jpg',
                        hotel1 + '3.jpg',
                        hotel1 + '4.jpg',
                        hotel1 + '5.jpg',
                        hotel1 + '6.jpg',
                        hotel1 + '7.jpg',
                        hotel1 + '8.jpg',
                        hotel1 + '9.jpg',
                        hotel1 + '10.jpg'
                    ],
                    servicosHotel.slice(0, 6),
                    tiposDeQuarto.slice(0, 4),
                    callback
                );
            },
            // Hotel 2
            function (callback) {
                hotelCreate(
                    'A Ver O Mar',
                    desc2,
                    'averomar@hoteispsi.com',
                    '(+351) 261 869 700',
                    'Hotel A Ver o Mar\nLargo dos Navegantes\n2655-320 Ericeira\nPORTUGAL',
                    '38°57\'56.0"N 9°25\'09.0"W',
                    [
                        hotel2 + '1.jpg',
                        hotel2 + '2.jpg',
                        hotel2 + '3.jpg',
                        hotel2 + '4.jpg',
                        hotel2 + '5.jpg',
                        hotel2 + '6.jpg',
                        hotel2 + '7.jpg',
                        hotel2 + '8.jpg',
                        hotel2 + '9.jpg',
                        hotel2 + '10.jpg'
                    ],
                    [servicosHotel[1], servicosHotel[2], servicosHotel[3], servicosHotel[4]].concat(
                        servicosHotel.slice(6, 13)
                    ),
                    tiposDeQuarto.slice(4, 7),
                    callback
                );
            },
            // Hotel 3
            function (callback) {
                hotelCreate(
                    'Mediterrâneo',
                    desc3,
                    'mediterraneo@hoteispsi.com',
                    '(+351) 289 570 700',
                    'Hotel Mediterrâneo\nPraia da Galé\n8200-995 Albufeira\nPORTUGAL',
                    '37°04\'55.0"N 8°19\'03.0"W',
                    [
                        hotel3 + '1.jpg',
                        hotel3 + '2.jpg',
                        hotel3 + '3.jpg',
                        hotel3 + '4.jpg',
                        hotel3 + '5.jpg',
                        hotel3 + '6.jpg',
                        hotel3 + '7.jpg',
                        hotel3 + '8.jpg',
                        hotel3 + '9.jpg',
                        hotel3 + '10.jpg'
                    ],
                    [servicosHotel[1], servicosHotel[2], servicosHotel[3], servicosHotel[4]].concat(
                        servicosHotel.slice(6, 14)
                    ),
                    tiposDeQuarto.slice(7),
                    callback
                );
            }
        ],
        // Optional callback
        cb
    );
}

async.series(
    //createCard, createReservas,
    [createServicosQuarto, createServicosHotel, createQuartos, createTipoDeQuarto, createHoteis, createCliente],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        } else {
            console.log('Populate completed');
        }
        // All done, disconnect from database
        mongoose.connection.close();
    }
);
