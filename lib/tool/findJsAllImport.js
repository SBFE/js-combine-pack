var fs = require('fs');
var byline = require('./lineStream.js');
var dStream = require('./depsStream.js');

module.exports = findJsAllImport;

//合并js依赖文件的方法 并且查找依赖结束
function findJsAllImport(basedir,singleFilepath,allFilesCon,callback) {
	var lineStream = new byline();
	var depsStream  = new dStream();
	var confStream = fs.createReadStream(singleFilepath);
	confStream.pipe(lineStream);
	lineStream.pipe(depsStream);
	depsStream.pipe(lineStream, basedir, singleFilepath, allFilesCon,callback);	
}

