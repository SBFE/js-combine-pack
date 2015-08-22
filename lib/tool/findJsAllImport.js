/**
 * 查找js依赖的所有文件
 * @fileoverview  查找js依赖的方法
 * @function findJsAllImport
 * @param {String} singleFilepath conf文件路径
 * @param {Object} allFilesCon 所有文件的内容
 * @param {Function} callback 查找依赖结束后执行的回调方法
 */

var fs = require('fs');
var byline = require('./lineStream.js');
var dStream = require('./depsStream.js');

function findJsAllImport(singleFilepath,allFilesCon,callback) {
	var lineStream = new byline();
	var depsStream  = new dStream();
	var confFile = fs.readFileSync(singleFilepath, 'utf-8');
	lineStream.pipe(depsStream);
	depsStream.pipe(lineStream,singleFilepath, allFilesCon,callback);
	lineStream.write(confFile);
	lineStream.end();
}

module.exports = findJsAllImport;

