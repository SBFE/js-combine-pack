/**
 * 测试读取依赖文件
 * @author wangqiang
 * @date 14/10/23
 */
var tool = require('../lib/pack-tool');
var fs = require('fs');
var basePath = __dirname+'/../../blog7';

tool.getAllJsDeps(basePath, 'conf/editor_new_publish.dev.js', function(files){
	console.log(files.join('\n'));
});
//
//tool.getAllJsDeps(basePath, '/conf/conf.dev.js', function(files){
//	var content = '';
//	for (var i = 0, len = files.length; i < len; i++) {
//		var file = files[i];
//		content += (fs.readFileSync(basePath+file)+'\n');
//	}
////	fs.writeFile('conf.js', content, function(err){
////		if (err) throw err;
////		console.log('It\'s saved!');
////	});
//	if (content == fs.readFileSync('conf.js')) {
//		console.log('测试结果正确');
//	} else {
//		console.error('测试结果不正确');
//	}
//
//});
