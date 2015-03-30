// nodejs查找依赖流

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

DepsStream.prototype.pipe = function(dest,confFile,jsMaps,callback){
	var that = this;
	var reg = /^\s*\$import\s*\(\s*(['|"])([\w\-\.\/\_]*)\1\s*\)\s*;?/gi;
	function ondata(chunk){
		var matches = reg.exec(chunk);
//		console.log('Chunk:', chunk);
		if(matches){
			if(matches[2] !== '/'){
				var reg2 = /^\//i;
				var matches2 = reg2.exec(matches[2]);
				if(!matches2){
					uri = '/' + matches[2];
				}else{
					uri = matches[2];
				}
				uri = path.join(uri.split(path.sep).join(path.sep));
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
			this.buffer += (chunk + '\n');
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
