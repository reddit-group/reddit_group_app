// Fetch environment variables
// 
require('./config/config');

// Module & Initializations
// 
const express = require('express'),
      app = express(),

      cookieParser     = require('cookie-parser'),
      bodyParser       = require('body-parser'),
      path             = require('path'),
      util             = require('util'),
      flash            = require('connect-flash'),
      exphbs           = require('express-handlebars'),
      expressSession   = require('express-session'),
      expressValidator = require('express-validator'),
      MongoStore       = require('connect-mongo')(expressSession)

      port = process.env.PORT || 3000;

// Initialize connection to mongodb
// 
const {mongoose} = require('./models/mongoose.js');

// Fetch route data
// 
const index = require('./routes/index')

// Application Middleware
// Handlebars configuration
var hbs = exphbs.create({
	defaultLayout: "main",
	extname: ".hbs",
	helpers: {
		section: function(name, options){
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});
app.engine('hbs', hbs.engine);
app.set('view engine', '.hbs');

// validator, session, cookieparser, and bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
	secret: '123qweasdzxc',
	saveUninitialized: false,
	maxAge: Date.now() + (60 * 60 * 1000),
	resave: false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	}),
	unset: 'destroy'
}));

// Error handling within views
app.use(flash());
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.errors = req.flash('errors');
    next();
});

// Routes Handling
// 
app.use('/', index);

// Server error handling
// - Catches 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = {app};
