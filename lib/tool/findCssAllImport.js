/**
 * @author xiaoyue
 * @email  weixiao909@gmail.com
 * @fileoverview 查找依赖文件的方法
 */

var fs = require('fs');
var byline = require('./lineStream.js');
var dStream = require('./cssDepsStream.js');

//合并js依赖文件的方法 并且查找依赖结束
function findCssAllImport(singleFilepath,allFilesCon,callback) {
	var lineStream = new byline();
	var depsStream  = new dStream();
	var confStream = fs.createReadStream(singleFilepath);
	confStream.pipe(lineStream);
	lineStream.pipe(depsStream);
	depsStream.pipe(lineStream,singleFilepath, allFilesCon,callback);	
}

module.exports = findCssAllImport;

