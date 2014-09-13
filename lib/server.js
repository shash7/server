
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * server.js
 * 
 * Delegates routes to routes.js
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';
	
	
	/* ----------------------------------------------------------------
	 * Imports
	 * ---------------------------------------------------------------- */
	var http        = require('http');
	var fs          = require('fs');
	var mime        = require('mime');
	var path        = require('path');
	var crypto      = require('crypto');
	var handlebars  = require('handlebars');
	var querystring = require('querystring');
	var Cookies     = require('cookies');
	var serverUtils = require('./utils.js');
	var _           = require('underscore');
	var config      = require('../config.js');
	
	var getArray   = [];
	var postArray  = [];
	var allArray   = [];
	
	// Default middleware
	var middleware = {
		cookie : function(req, res) {
			var cookie = new Cookies(req, res, config.cookieSecret);
			req.cookie = cookie.get(config.cookieName);
			return {
				req : req,
				res : res
			};
		},
		query : function(req, res) {
			var result = false;
			var arr = req.url.split('/');
			var chunk = arr[arr.length-1];
			if(chunk[0] === '?') {
				chunk = chunk.substr(1);
				result = querystring.parse(chunk);
			}
			req.query = result;
			return {
				req : req,
				res : res
			};
		}
	};
	
	/* ----------------------------------------------------------------
	 * Utility functions
	 * ---------------------------------------------------------------- */
	function containsParam(url, truncate) {
		var arr = url.split('/');
		var text = arr[arr.length-1];
		
		if(text.indexOf(':') > -1) {
			if(truncate) {
				arr.pop();
				return arr.join('/') || '/';
			} else {
				return text.slice(1);
			}
		} else {
			return false;
		}
	}
	
	// Checks route, assigns request functions and middlewares
	function checkRoute(req, res, arr) {
			
		var routeFound = false;
		
		// Optimize the looping mechanism
		arr.map(function(data) {
			if(data.route === req.url && !data.param) {
				
				// adds middleware here
				data.middleware.map(function(mw) {
					var obj = middleware[mw](req, res);
					req = obj.req;
					res = obj.res;
				});
				data.callback(req, res);
				routeFound = true;
			}
			if(data.param && data.route === path.dirname(req.url) && !routeFound) {
				
				// adds middleware here
				data.middleware.map(function(mw) {
					var obj = middleware[mw](req, res);
					req = obj.req;
					res = obj.res;
				});
				req[data.param] = path.basename(req.url);
				data.callback(req, res);
				routeFound = true;
			}
		});

		return routeFound;
	}
	
	
	/*
	 * Exported utility functions
	 */
	var utils = {
		containsFile : function(url) {
			var arr = url.split('/');
			var text = arr[arr.length-1];

			if(text.indexOf('.') > -1) {
				return text;
			} else {
				return false;
			}
		},
		send404 : function(res) {
			res.writeHead(404, {
				'Content-Type' : 'text/html'
			});
			res.write('<h1>404 Not found</h1>');
			res.end();
		},
		send500 : function(res) {
			res.writeHead(500, {
				'Content-Type' : 'text/html'
			});
			res.write('<h1>404 Not found</h1>');
			res.end();
		},
		redirect : function(res, url, code) {
			code = code || 301;
			res.writeHead(code, {
				'Location' : url
			});
			res.end();
		},
		serveFile : function(filePath, res) {
			fs.exists(filePath, function(exists) {
				if(exists) {
					// Add optional ut8 parameter in function
					fs.readFile(filePath, /* 'utf8',*/ function(err, file) {
						if(file) {
							res.writeHead(200, {
								'Content-Type' : mime.lookup(filePath)
							});
							res.write(file, 'binary');
							res.end();
						} else {
							send500(res);
						}
					});
				} else {
					send404(res);
				}
			});
		},
		serveJson : function(obj, res, code) {
			code = code || 200;
			res.writeHead(code, {
				'Content-Type' : 'application/json'
			});
			res.write(JSON.stringify(obj));
			res.end();
		},
		parseQuery : function(req) {
			var result = false;
			var arr = req.url.split('/');
			var chunk = arr[arr.length-1];
			if(chunk[0] === '?') {
				chunk = chunk.substr(1);
				result = querystring.parse(chunk);
			}
			return result;
		}
	};
	
	
	/* ----------------------------------------------------------------
	 * Public functions
	 * ---------------------------------------------------------------- */
	module.exports = function() {
		
		/* The next four public functions add the callbacks, params, middlewares
		 * and routes inside the above arrays
		 */
		// Adds route functions for GET method
		function get(route, callback, middleware) {
			var obj = {};
			var param = containsParam(route);
			if(param) {
				obj.param      = param;
				obj.route      = containsParam(route, true);
			} else {
				obj.route = route;
			}
			obj.middleware = middleware || [];
			obj.callback   = callback;
			getArray.push(obj);
		}
		
		// Adds route functions for POST method
		function post(route, callback, middleware) {
			var obj = {};
			var param = containsParam(route);
			if(param) {
				obj.param = param;
				obj.route = containsParam(route, true);
			} else {
				obj.route = route;
			}
			obj.middleware = middleware || [];
			obj.callback   = callback;
			postArray.push(obj);
		}
		
		// Adds route functions for all methods
		function all(route, callback, middleware) {
			var obj = {};
			var param = containsParam(route);
			if(param) {
				obj.param = param;
				obj.route = containsParam(route, true);
			} else {
				obj.route = route;
			}
			obj.middleware = middleware || [];
			obj.callback   = callback;
			allArray.push(obj);
		}
		
		// Adds middleware
		function use(name, callback) {
			middleware[name] = callback;
		}
		
		// Main call to start the http server
		function start(port) {
			
			port = port || 80;
			http.createServer(function(req, res) {
				
				var routeFound = false;
				
				if(req.method === 'GET') {
					routeFound = checkRoute(req, res, getArray);
				} else if(req.method === 'POST') {
					routeFound = checkRoute(req, res, postArray);
				} else {
					routeFound = checkRoute(req, res, allArray);
				}
				
				/* Add 404 here */
				if(!routeFound) {
					res.end();
				}
				
			}).listen(port);
		}
		
		
	/* ----------------------------------------------------------------
	 * Exports
	 * ---------------------------------------------------------------- */
		return {
			get   : get,
			post  : post,
			all   : all,
			start : start,
			use   : use,
			utils : utils
		};
	};
	
})();