/**
 * @author weixiao909
 * @email  weixiao909@gmail.com
 * @fileoverview 基本工具集添加
 */


var config = require('./tool/config.js');
var findFiles = require('./tool/findFiles.js');
var findalldeps = require('./tool/dependencies.js');

var lineStream = require('./tool/lineStream');
var depsStream = require('./tool/depsStream');
var md5Cache = require('./tool/cache.js');

exports.config = config;
exports.findFiles = findFiles;
exports.findalldeps = findalldeps;

exports.lineStream = lineStream;
exports.depsStream = depsStream;

exports.md5Cache = md5Cache;


