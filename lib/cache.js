
/* jslint undef: true, vars: true */
/* global window, document, $ */

/*
 * cache.js
 * 
 * Used for caching objects in an array
 */

(function(exports, undefined) {
	
	'use strict';
	
	function cache() {
		
		var arr = [];
		
		function compact(arr) {
			arr = arr.map(function(data) {
				if(data !== undefined || data !== null || data !== false) {
					return data;
				}
			});
			return arr;
		}
		
		function set(key, value) {
			arr.push({
				key : key,
				value : value
			});
			return true;
		}
		
		function get(key) {
			var result;
			arr.map(function(data) {
				if(data.key === key) {
					result = data.value;
				}
			});
			return result;
		}
		
		function remove(key) {
			arr = arr.map(function(data) {
				if(data.key === key) {
					data = null;
				}
				return data;
			});
			arr = compact(arr);
			return true;
		}
		
		function getAll() {
			return arr;
		}
		
		return {
			set : set,
			get : get,
			remove : remove,
			getAll : getAll
		};
	}
	
	exports.Cache = cache;
	
})(exports);