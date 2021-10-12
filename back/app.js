var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

// Imports routes
var indexRouter = require('./routes/index');

var compression = require('compression');
var helmet = require('helmet');

// Load app
var app = express();

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb+srv://fc51033:sporting@tutorial-2iujo.azure.mongodb.net/HoteisPSI?retryWrites=true&w=majority';

// Use inside VPN
// var dev_db_url = 'mongodb://psi016:psi016@localhost:27017/psi016?retryWrites=true&authSource=psi016';

var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Add '/' route
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
});

module.exports = app;
