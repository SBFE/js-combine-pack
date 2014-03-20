/*
 *压缩文件
*/
var UglifyJS = require("uglify-js");
var formated = '';
module.exports = function(code,conf){
	formated = UglifyJS.minify(code,{fromString : true});
	return formated.code + ';\n';
};
