
/* jslint undef: true */
/* global window, document, $ */

/*
 * config.js
 * 
 * User configuration options
 */

module.exports = {
	url  : null,
	port : 8000,
	http : true,
	cookieName : 'app',
	cookeSecret : 'zz',
	groups : [
		{
			name    : 'haxor',
			message : 'Welcome to haxor, post only topics related to l33t haxx'
		},
		{
			name    : 'dpp',
			message : 'Welcome to dpp, this is a general chat so don\'t flame newbies'
		}
	],
	admins : [
		{
			name : 'shash7',
			password : 'f3226f91f77a87d909b8920adc91f9a301a7316b'
		}
	]
};
