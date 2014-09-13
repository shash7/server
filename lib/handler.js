/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * handler.js
 * 
 * Route handler
 * ---------------------------------------------------------------- */


/* ----------------------------------------------------------------
 * $imports
 * ---------------------------------------------------------------- */
var utils      = require('./server.js')().utils;
var fs         = require('fs');
var handlebars = require('handlebars');
var cookie     = require('cookie');
var Cookies    = require('cookies');
var auth       = require('./auth.js');
var config     = require('../config.js');


/* ----------------------------------------------------------------
 * Templates
 * ---------------------------------------------------------------- */
var templateDir = __dirname + '/../views/';
var templates = {};

function compile() {
	fs.readdir(templateDir, function(err, files) {

		files.forEach(function(fileName) {
			fs.readFile(templateDir + fileName, 'utf8', function(err, file) {
				templates[fileName] = handlebars.compile(file);
			});
		});
	});
}

compile();

/* ----------------------------------------------------------------
 * $utils
 * ---------------------------------------------------------------- */


module.exports = {
	GET : {
		index : function(req, res) {
			var template = templates['about.html']({ name : 'shash7' });
			utils.serveFile(__dirname + '/../public/index.html', res);
		},
		profile : function(req, res) {
		},
		profileName : function(req, res) {
		}
	},
	POST : {
		login : function(req, res) {
			console.log(req.cookie);
			res.end();
		},
		signup : function(req, res) {
			res.end();
		}
	}
};