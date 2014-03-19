var stream = require('stream').Stream;
var util = require('util');
var fs = require('fs');
var path = require('path');
// var format = require('./utils/format');
var spawn = require('child_process').spawn;

module.exports = DepsStream;
util.inherits(DepsStream,stream);

function DepsStream(){
	this.writable = true;
	this.readable = true;
	this.buffer = '';
	this.depsList = [];
};

DepsStream.prototype.write = function(data){
	this.emit('data',data);
};
DepsStream.prototype.pipe = function(dest,config,confFile,jsMaps,confList,jsDepsMap,callback){
	var that = this;
	var reg = /^\s*\$import\s*\(\s*(['|"])([\w\-\.\/\_]*)\1\s*\)\s*;?/gi;
	function ondata(chunk){
		console.log(chunk + "1111111111111");
		var matches = reg.exec(chunk);
		if(matches){
			console.log(matches);
			if(matches[2] !== '/'){
				var reg2 = /^\//i;
				var matches2 = reg2.exec(matches[2]);
				if(!matches2){
					uri = '/' + matches[2];
				}else{
					uri = matches[2];
				}
				// console.log(uri);
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
		console.log("111111111111");
		jsDepsMap[confFile] = this.depsList;
		console.log(jsDepsMap[confFile]);
		var filePublishUrl = path.join(config.publishUrl,confFile);
		// var filePublishMiniUrl = path.join(config.publishMiniUrl,confFile);

		filePublishUrl = filePublishUrl.replace(/\\conf/,'').replace(/\.dev/,'');
		// filePublishMiniUrl = filePublishMiniUrl.replace(/\\conf/,'').replace(/\.dev/,'');

		var code = this.buffer;
		fs.writeFileSync(filePublishUrl,code);
		console.log(filePublishUrl + ' combine done.');

		// var formatCode = format(code,config);
		// fs.writeFileSync(filePublishMiniUrl,formatCode);
		// console.log(filePublishMiniUrl + ' compress done.');

		if(confList && confList.length){
			callback.call(null,config,confList,jsMaps,jsDepsMap);
		}else{
			fs.writeFileSync(config.depsMapUrl,JSON.stringify(jsDepsMap));
			console.timeEnd('package-time');
		}
	}
	that.on('end',onend);
	that.on('data',ondata);
};

DepsStream.prototype.end = function(){
	this.emit('end');
};
