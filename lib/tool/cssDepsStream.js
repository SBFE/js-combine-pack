//nodejs css查找依赖流

var stream = require('stream').Stream;
var util = require('util');
var path = require('path');

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
DepsStream.prototype.pipe = function(dest,confFile,cssMaps,callback){
	var that = this;
	var reg = /^\s*@import\s*(url\s*\()*\s*(['|"]?)([\w\-\.\:\/\\\s]+)\2\s*(\))*\s*;?/i;
	function ondata(chunk){
		var matches = reg.exec(chunk);
		if(matches){
			var uri = matches[3];
			if(uri[0] != '/'){
				uri = path.join(path.dirname(confFile), uri.split(path.sep).join(path.sep));
			}

			if(this.depsList.indexOf(uri) >= 0){
				dest.write('\n');
			}else{
				this.depsList.push(uri);
				if(cssMaps[uri]){
					var code = cssMaps[uri].replace(/^\uFEFF/,'');
					//import的文件中去掉charset
					var r = /\@charset([^;]*);/ig;
					code = code.replace(r,'');
					dest.write('\n'+code);
				}else{
					dest.write('\n');
				}
			}
		}else{
			chunk = chunk.replace(/^\uFEFF/,'');
			this.buffer += chunk + '\n';
		}
	}
	function onend(){
		var code = this.buffer;
		if(callback){
			callback(code);
		}
	}
	that.on('end',onend);
	that.on('data',ondata);
};

DepsStream.prototype.end = function(){
	this.emit('end');
};
