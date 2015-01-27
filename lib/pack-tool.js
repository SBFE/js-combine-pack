/**
 * @fileoverview Combine and compress js css, base method entrance
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
 * 根据正则表达式分析引用的文件
 * @function getAllJsDeps
 * @param {String} basepath
 * @param {String} configFilePath
 * @param {Function} callback
 * @param {RegExp} pathReg
 */
exports.getAllJsDeps = getAllJsDeps;

