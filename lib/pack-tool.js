/**
 * @author weixiao909
 * @email  weixiao909@gmail.com
 * @fileoverview 基本工具集添加
 */


var config = require('./tool/config.js');
var findFiles = require('./tool/findFiles.js');

var lineStream = require('./tool/lineStream');
var depsStream = require('./tool/depsStream');
var md5Cache = require('./tool/cache.js');
var findJsAllImport = require('./tool/findJsAllImport');

exports.config = config;
exports.findFiles = findFiles;

exports.lineStream = lineStream;
exports.depsStream = depsStream;

exports.findJsAllImport = findJsAllImport;


exports.md5Cache = md5Cache;


