/**
 * 分析文件依赖，输出文件数组.
 * BUG：多行注释里有import文件会分析在数组里
 * @author wangqiang
 * @date 14/10/23
 */
var fs = require('fs');
var byline = require('./lineStream.js');
var fileCount = 0;
var processedFile = {};

/**
 * 检测文件是否在父级节点上
 * @param node
 * @param file
 * @returns {boolean}
 */
function isParent(node, file){
	while (node && node.parent && node.file) {
		if (node.file == file) {
			return true;
		}
		node = node.parent;
	}
	return false;
}

/**
 * 获取循环引用的路径
 * @param node
 * @param uri
 * @returns {*}
 */
function getStack(node, uri) {
	var path = uri;
	while (node && node.parent && node.file) {
		path += ('-->' + node.file);
		if (node.file == uri) {
			break;
		}
		node = node.parent;

	}
	return path;
}

/**
 * 查找树节点的root节点
 * @param node
 * @returns {*}
 */
function findRootNode(node){
	while (node && node.parent){
		node = node.parent;
	}
	return node;
}

//合并js依赖文件的方法 并且查找依赖结束
function getAllJsDeps(basepath, configFilePath, pathReg, callback, depObj) {
	// 添加分析过的文件
	if (processedFile[configFilePath]) {
		processedFile[configFilePath].parent = depObj;
		depObj.leafs.push(processedFile[configFilePath]);
		return;
	}

	var node = {file:configFilePath, leafs:[], parent: depObj};
	if (depObj) {
		depObj.leafs.push(node);
	}

	fileCount++;

	var lineStream = new byline();
	if (0 !== configFilePath.indexOf('/')) {
		configFilePath = '/' + configFilePath;
	}

	var filePath = basepath+configFilePath;
	if (!fs.existsSync(filePath)) {
		console.error('[错误]：文件', filePath, ' 不存在');
		fileCount --;
		return;
	}

	var deps = [];
	var confStream = fs.createReadStream(filePath);
	confStream.pipe(lineStream);
	// 按行读取文件，分析是否符合正则匹配
	lineStream.on('data', function(chunk){

		pathReg.lastIndex = 0;
		var matches = pathReg.exec(chunk), uri;
		if(matches){
			if(matches[2] !== '/'){
				var reg2 = /^\//i;
				var matches2 = reg2.exec(matches[2]);
				if(!matches2){
					uri = '/' + matches[2];
				}else{
					uri = matches[2];
				}
				if (isParent(node, uri)) {
					console.error('存在循环引用文件:', getStack(depObj, uri));
				} else {
					deps.push(uri);
				}
			}
		}
	});
	lineStream.on('end', function(){
		processedFile[configFilePath] = node;
		for (var i = 0, len = deps.length; i < len; i++) {
			var file = deps[i];
			getAllJsDeps(basepath, file, pathReg, callback, node);
		}
		fileCount--;
		if (0 === fileCount) {
			var rootNode = findRootNode(node);
			callback(rootNode);
		}
		confStream.close();
	});
}

function TreeWalker(node, cb, filter){
	if (filter && false === filter(node, cb)) {
		return;
	}
	var leafs = node.leafs;
	if (isParent(node.parent, node.file)) {
		return;
	}
	
	for (var i = 0, len = leafs.length; i < len; i++) {
		var leaf = leafs[i];
		if (leaf.file) {
			if (0 < leaf.leafs.length) {
				TreeWalker(leaf, cb, filter);
			}
			cb(leaf.file, leaf, node);
		}

	}
	cb(node.file, node, node);
}
/**
 * 根据正则表达式分析引用的文件
 * @param {String} basepath
 * @param {String} configFilePath
 * @param {Function} callback
 * @param {RegExp} pathReg
 */
module.exports = function(basepath, configFilePath, callback, pathReg, filter) {

	var imports=[], importsFile = {};
	processedFile = {};
	pathReg = pathReg || /^[ \t]*\$import\s*\(\s*(['|"])([\w\-\.\/\_]*)\1\s*\)\s*;?/gi;

	getAllJsDeps(basepath, configFilePath, pathReg, function(depsTree){
		TreeWalker(depsTree, function(file){
			if (!importsFile[file]) {
				importsFile[file] = 1;
				imports.push(file);
			}
		}, filter);
		callback(imports);
	});
};