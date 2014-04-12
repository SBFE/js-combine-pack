/**
 * @author xiaoyue
 * @email  weixiao909@gmail.com
 * @fileoverview 查找文件
 */
var walk = require('./utils/dirWalker.js');
var fs = require('fs');
var path = require('path');

var filesFunc = {
	allFilesList : function(url){
		return walk(url).js;
	},
	allCssFilesList: function(url){
		var cssList = walk(url);
		return cssList.css.concat(cssList.other);
	},
	allFilesCon : function(list,baseUrl){
		var jsMap = {};
		list.forEach(function(value){
			var v = value.replace(baseUrl,'');
			jsMap[v] = fs.readFileSync(value,'utf-8');
		});
		return jsMap;
	},
	allCssFilesCon : function(list,baseUrl){
		var cssMap = {};
		list.forEach(function(value){
			if(path.extname(value) === '.css'){
				cssMap[value] = fs.readFileSync(value,'utf-8');
			}
		});
		return cssMap;
	}
}

module.exports = filesFunc;

