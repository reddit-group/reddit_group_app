// Modules 
const express      = require('express'),
      bodyParser   = require('body-parser'),
      cookieParser = require('cookie-parser'),
      csrf         = require('csurf'),
      flash        = require('connect-flash');

// Initialize express router
var router = express.Router();

// CSRF protection
var csrfProtection = csrf({ cookie: true });

// Models go here

// App
var {app} = require('../app.js');

// BodyParser middleware
router.use(bodyParser.urlencoded({
	extended: true
}));

// GET - /
router.get('/', function(req, res, next) {
    res.render('index', {
        heading: "This is a heading",
        subtitle: "This is a subtitle!"
    });
});

module.exports = router;
