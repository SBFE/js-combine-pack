/**
 * 查找css依赖的所有文件
 * @fileoverview  查找css依赖的方法
 * @function findCssAllImport
 * @param {String} singleFilepath conf文件路径
 * @param {Object} allFilesCon 所有文件的内容
 * @param {Function} callback 查找依赖结束后执行的回调方法
 */

var fs = require('fs');
var byline = require('./lineStream.js');
var dStream = require('./cssDepsStream.js');

function findCssAllImport(singleFilepath,allFilesCon,callback) {
	var lineStream = new byline();
	var depsStream  = new dStream();
	var confStream = fs.createReadStream(singleFilepath);
	confStream.pipe(lineStream);
	lineStream.pipe(depsStream);
	depsStream.pipe(lineStream,singleFilepath, allFilesCon,callback);	
}

module.exports = findCssAllImport;

