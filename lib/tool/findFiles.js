/**
 * @author weixiao909
 * @email  weixiao909@gmail.com
 * @fileoverview 打包工程的配置文件
 */
var walk = require('./utils/dirWalker.js');
var fs = require("fs");

var filesFunc = {
	allFilesList : function(url){
		return walk(url).js;
	},
	allFilesCon : function(list){
		var jsMap = {};
		list.forEach(function(value){
			jsMap[value] = fs.readFileSync(value,'utf-8');
		});
		return jsMap;
	}
}

module.exports = filesFunc;

