/**
 * @author xiaoyue
 * @email  weixiao909@gmail.com
 * @fileoverview 基本工具集添加
 */


var config = require('./tool/config.js');
var findFiles = require('./tool/findFiles.js');
var lineStream = require('./tool/lineStream');
var depsStream = require('./tool/depsStream');
var findJsAllImport = require('./tool/findJsAllImport');
var findCssAllImport = require('./tool/findCssAllImport');
var getAllJsDeps = require('./tool/getAllJsDeps');

exports.config = config;
exports.findFiles = findFiles;
exports.lineStream = lineStream;
exports.depsStream = depsStream;
exports.findJsAllImport = findJsAllImport;
exports.findCssAllImport = findCssAllImport;

/**
 * 合并js依赖文件的方法，并且查找依赖，该方法为异步方法
 * @param {String} basepath 引入文件正则表达式的基本路径 如:
 * <pre>
 * // basepath='/home/john/workspace/demo';<br>
 * // a.js有如下文件引入<br>
 * $import('person/name.js');<br>
 * // 引入文件查找的实际路径为：/home/john/workspace/demo/person/name.js
 * </pre>
 * @param {String} configFilePath 需要分析引入的文件
 * @param {Function} callback 引入文件分析完毕后回调函数
 * @param {RegExp} pathReg 引入文件正则表达式，默认引入关键字: $import
 * @param {Function} filter 过滤器，返回false在调用callback传入的引入文件数据里不会包含改文件的引入文件
 */
exports.getAllJsDeps = getAllJsDeps;

