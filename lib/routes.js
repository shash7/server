
/* jslint undef: true */
/* global window, document, $ */

/*
 * routes.js
 * 
 * Serves web page
 */

(function() {
	
	'use strict';
	
	var fs         = require('fs');
	var path       = require('path');
	var mime       = require('mime');
	var handlebars = require('handlebars');
	var server     = require('./server.js')();
	var utils      = server.utils;
	var url        = require('url');
	var handler    = require('./handler.js');
	var Cookies    = require('cookies');
	
	
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
	
	
	/* ----------------------------------------------------------------
	 * Utility functions
	 * ---------------------------------------------------------------- */
	function containsFile(url) {
		var arr = url.split('/');
		var text = arr[arr.length-1];
		
		if(text.indexOf('.') > -1) {
			return text;
		} else {
			return false;
		}
	}
	
	// Optimize
	compile();
	
	
	/* ----------------------------------------------------------------
	 * Routes
	 * ---------------------------------------------------------------- */
	exports.start = function() {
		
		server.use('haxor', function(req, res) {
			return 'zzzz';
		});
		
		server.get('/', handler.GET.index);
		
		server.get('/:name', function(req, res) {
			var qs = utils.parseQuery(req);
			res.writeHead(200, {
				'Content-type' : 'text/html'
			});
			if(qs) {
				res.write(JSON.stringify(qs));
			} else {
			res.write(templates['about.html']({name : req.name }));
			}
			res.end();
		});
		
		server.get('/css/:fileName', function(req, res) {
			var fileName = containsFile(req.url);
			utils.serveFile(__dirname + '/../public/css/' + fileName, res);
		});
		
		server.get('/js/:fileName', function(req, res) {
			var fileName = containsFile(req.url);
			utils.serveFile(__dirname + '/../public/js/' + fileName, res);
		});
		
		server.get('/img/:fileName', function(req, res) {
			var fileName = req.fileName;
			utils.serveFile(__dirname + '/../public/img/' + fileName, res);
		});

		server.post('/login', handler.POST.login, ['cookie']);
		
		server.post('/signup', function(req, res) {
			setTimeout(function() {
				res.end();
			}, 10);
		});
		
		
	/* ----------------------------------------------------------------
	 * Middlewares
	 * ---------------------------------------------------------------- */
		
		server.use('fx', function(str) {
			return this.url + str;
		}, true);
		
		server.start();
	};
	
})();