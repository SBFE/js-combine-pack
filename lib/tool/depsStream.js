var stream = require('stream').Stream;
var util = require('util');
var fs = require('fs');
var path = require('path');
var format = require('./utils/format');

module.exports = DepsStream;
util.inherits(DepsStream,stream);

function DepsStream(done){
	this.writable = true;
	this.readable = true;
	this.buffer = '';
	this.depsList = [];
};

DepsStream.prototype.write = function(data){
	this.emit('data',data);
};
DepsStream.prototype.pipe = function(dest,basedir,confFile,jsMaps,callback){
	var that = this;
	var reg = /^\s*\$import\s*\(\s*(['|"])([\w\-\.\/\_]*)\1\s*\)\s*;?/gi;
	function ondata(chunk){
		var matches = reg.exec(chunk);
		if(matches){
			if(matches[2] !== '/'){
				var reg2 = /^\//i;
				var matches2 = reg2.exec(matches[2]);
				if(!matches2){
					uri = '/' + matches[2];
				}else{
					uri = matches[2];
				}
				uri = path.join(basedir, uri.split(path.sep).join(path.sep));
			}
			if(this.depsList.indexOf(uri) >= 0){
				dest.write('\n');
			}else{
				this.depsList.push(uri);
				if(jsMaps[uri]){
					var code = jsMaps[uri].replace(/^\uFEFF/,'');
					dest.write('\n' + code);
				}else{	
					dest.write('\n');
				}
			}
		}else{
			chunk = chunk.replace(/^\uFEFF/,'');
			//this.buffer.push(chunk);
			this.buffer += chunk + '\n';
		}
	}
	function onend(){
		// jsDepsMap[confFile] = this.depsList;
		// var filePublishUrl = path.join(config.publishUrl,path.basename(confFile));
		// filePublishUrl = filePublishUrl.replace(/\.dev/,'');
		var code = this.buffer;
		if(callback){
			callback(code);
			return;
		}
		// if(!config.minify) {
		// 	if(!fs.existsSync(filePublishUrl)){
		// 		fs.writeFileSync(filePublishUrl,code);
		// 		console.log(filePublishUrl + ' combine done.');
		// 	}
		// }else{
		// 	var formatCode = format(code);
		// 	if(!fs.existsSync(filePublishUrl)){
		// 		fs.writeFileSync(filePublishUrl,formatCode);
		// 		console.log(filePublishUrl + ' compress done.');
		// 	}
		// }
		// if(confList && confList.length){
		// 	callback.call(null,config,confList,jsMaps,jsDepsMap);
		// }else{
		// 	fs.writeFileSync(config.depsMapUrl,JSON.stringify(jsDepsMap));
		// 	console.log('package-time');
		// 	that.done();
		// }
	}
	that.on('end',onend);
	that.on('data',ondata);
};

DepsStream.prototype.end = function(){
	this.emit('end');
};
