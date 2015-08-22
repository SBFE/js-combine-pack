// nodejs按行读取文件流

var Stream = require('stream').Stream,
	util = require('util');

var LineStream = function() {
	this.writable = true;
	this.readable = true;
	this.buffer = '';
};

util.inherits(LineStream, Stream);

LineStream.prototype.write = function(data, encoding) {
	if (Buffer.isBuffer(data)) {
		data = data.toString(encoding || 'utf8');
	}

	var parts = data.split(/\n/g);
	var len = parts.length;

	for (var i = 0; i < len; i++) {
		this.emit('data', parts[i]+'\n');
	}
};

LineStream.prototype.end = function() {
	if(this.buffer.length > 0){
		this.emit('data',this.buffer);
		this.buffer = '';
	}
	
	this.emit('end');
};

module.exports = LineStream;

