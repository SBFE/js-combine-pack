var jsp = require('./uglify-js').parser;
var pro = require('./uglify-js').uglify;

var formated = '';

module.exports = function(code,conf){
	var ast;
	try{
		ast = jsp.parse(code);
		if(conf && conf.minify){
			ast = pro.ast_mangle(ast);	
			//ast = pro.ast_squeeze(ast);
		}
	}catch(exp){
		throw exp;
	}
	formated = pro.gen_code(ast);	
	ast = null;
	return formated + ';\n';
};
