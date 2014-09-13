
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * socket.js
 * 
 * Handles socket connection
 * ---------------------------------------------------------------- */

(function() {
	
	'use strict';
	
	var Cache  = require('./cache.js');
	var config = require('../config.js');
	var net    = require('net');
	var moment = require('moment');
	var _      = require('underscore');
	var uuid   = require('node-uuid');

	var HOST       = '127.0.0.1';
	var PORT       = config.port || 8000;
	var socketList = [];
	
	function addCache(sock) {
		var id = uuid.v1();
		sock.id = id;
		socketList.push(sock);
		return id;
	}
	
	function removeCache(id) {
		var sock;
		for(var i = 0, len = socketList.length; i < len; i++) {
			if(id === socketList[i].id) {
				sock = socketList[i];
			}
		}
		socketList = _.compact(socketList);
		return sock;
	}
	
	exports.start = function() {
		
		var host  = HOST;
		var port  = PORT;
		
		net.createServer(function(sock) {
			

			// We have a connection - a socket object is assigned to the connection automatically
			log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
			addCache(sock);

			// Add a 'data' event handler to this instance of socket
			sock.on('data', function(data) {

				// console.log('DATA ' + sock.remoteAddress + ': ' + data);
				// Write the data back to the socket, the client will receive it as data from the server
				var obj = '' + data;
				obj = JSON.parse(obj);
				
				var temp = {
					time    : moment().format('MMMM Do, h:mm:ss a'),
					message : obj.message,
					sender  : obj.sender
				};
				
				socketList.map(function(data) {
					data.write(JSON.stringify(temp));
				});

			});

			// Add a 'close' event handler to this instance of socket
			sock.on('close', function(data) {
				log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
			});

			sock.on('end', function(data) {
				console.log('end');
				log('Disconnected : ' + data);
			});
			
			sock.on('error', function(data) {
				console.log('error');
				log('Disconnected ERROR : ' + data);
			});

		}).listen(port, host);

		console.log('Server listening on ' + HOST +':'+ PORT);
		
	};
	
})();