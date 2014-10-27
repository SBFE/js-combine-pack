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
 * 检测文件是否循环引用
 * @param pnNode
 * @param file
 * @returns {boolean}
 */
function hasImport(pnNode, file){
	while (pnNode && pnNode.parent && pnNode.file) {
		if (pnNode.file == file) {
			return true;
		}
		pnNode = pnNode.parent;
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

//合并js依赖文件的方法 并且查找依赖结束
function getAllJsDeps(basepath, configFilePath, treeNode, pathReg, callback, parent) {
	if (processedFile[configFilePath]) {
		// 添加分析过的文件
		treeNode.push(processedFile[configFilePath]);
		return;
	}

	fileCount++;
	var depObj = {file:configFilePath, deps:[], parent: parent};
	var deps = [];
	treeNode.push(depObj);
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
				if (hasImport(parent, uri)) {
					console.error('存在循环引用文件:', getStack(depObj, uri));
				} else {
					deps.push(uri);
				}
			}
		}
	});
	lineStream.on('end', function(){
		processedFile[configFilePath] = depObj;
		for (var i = 0, len = deps.length; i < len; i++) {
			var file = deps[i];
			getAllJsDeps(basepath, file, depObj.deps, pathReg, callback, depObj);
		}
		fileCount--;
		if (0 === fileCount) {
			callback();
		}
		confStream.close();
	});
}

function TreeWalker(tree, cb){
	if (tree instanceof Array) {
		if (tree.length == 0) {
			return;
		}
		for (var i = 0, len = tree.length; i < len; i++) {
			var leaf = tree[i];
			if (leaf.file) {
				TreeWalker(leaf.deps, cb);
				cb(leaf.file, leaf, tree);
			}

		}
	} else {
		TreeWalker(tree.deps, cb);
		cb(tree.file, null, tree);
	}
}
/**
 * 根据正则表达式分析引用的文件
 * @param {String} basepath
 * @param {String} configFilePath
 * @param {Function} callback
 * @param {RegExp} pathReg
 */
module.exports = function(basepath, configFilePath, callback, pathReg) {

	var depsTree = [], imports=[], importsFile = {};
	processedFile = {};
	pathReg = pathReg || /^[ ]*\$import\s*\(\s*(['|"])([\w\-\.\/\_]*)\1\s*\)\s*;?/gi;

	getAllJsDeps(basepath, configFilePath, depsTree, pathReg, function(){
		TreeWalker(depsTree, function(file, leaf){
			if (!importsFile[file]) {
				importsFile[file] = 1;
				imports.push(file);
			}
		});
		callback(imports);
	});
};