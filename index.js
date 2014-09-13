
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * index.js
 * 
 * Sets up riki-server
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';
	
	var socket = require('./lib/socket.js');
	var config = require('./config.js');
	
	socket.start();
	
	if(config.http) {
		var routes = require('./lib/routes.js');
		
		routes.start();
	}

})();