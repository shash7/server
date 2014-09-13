
/* jslint undef: true */
/* global window, document, $ */

/* ----------------------------------------------------------------
 * utils.js
 * 
 * Contains utils for server, like middlewares and stuff
 * ---------------------------------------------------------------- */

var fs = require('fs');
var mime = require('mime');

module.exports = {
	sendFile : function(filePath) {
		console.log(arguments);
		console.log('zz');
		fs.exists(filePath, function(exists) {
			if(exists) {
				// Add optional ut8 parameter in function
				fs.readFile(filePath, /* 'utf8',*/ function(err, file) {
					if(file) {
						this.res.writeHead(200, {
							'Content-Type' : mime.lookup(filePath)
						});
						this.res.write(file, 'binary');
						this.res.end();
					} else {
						send500(res);
					}
				});
			} else {
				send404(res);
			}
		});
	}
};