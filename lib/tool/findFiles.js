// returns tool utils

var walk = require('./utils/dirWalker.js');
var fs = require('fs');
var path = require('path');

var filesFunc = {
	/**
	 * Returns object has three properties js, css, other; property type is Array;
	 * @function allFilesList
	 * @param {String} url 
	 * @returns {Object}  
	 */
	allFilesList : function(url){
		return walk(url).js;
	},
	/**
	 * Returns css files list
	 * @function allCssFilesList
	 * @param {String} url 
	 * @returns {Array}  
	 */
	allCssFilesList: function(url){
		var cssList = walk(url);
		return cssList.css.concat(cssList.other);
	},
	/**
	 * Returns object, key is file path, value is file content
	 * @function allFilesCon
	 * @param {String} list
	 * @param {String} baseUrl
	 * @returns {Object}  
	 */
	allFilesCon : function(list,baseUrl){
		var jsMap = {};
		list.forEach(function(value){
			var v = value.replace(baseUrl,'');
			jsMap[v] = fs.readFileSync(value,'utf-8');
		});
		return jsMap;
	},
	/**
	 * Returns object, key is file path, value is file content
	 * @function allCssFilesCon
	 * @param {String} list
	 * @param {String} baseUrl
	 * @returns {Object}  
	 */
	allCssFilesCon : function(list,baseUrl){
		var cssMap = {};
		list.forEach(function(value){
			if(path.extname(value) === '.css'){
				cssMap[value] = fs.readFileSync(value,'utf-8');
			}
		});
		return cssMap;
	}
};

module.exports = filesFunc;

