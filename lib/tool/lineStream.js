// nodejs按行读取文件流

var Stream = require('stream').Stream,
	util = require('util');

// convinience API
module.exports = function(readStream) {
	return module.exports.createStream(readStream);
};

// new API
module.exports.createStream = function(readStream) {
	if (readStream) {
		return module.exports.createLineStream(readStream);
	} else {
		return new LineStream();
	}
};

// deprecated API
module.exports.createLineStream = function(readStream) {
	if (!readStream) {
		throw new Error('expected readStream');
	}
	if (!readStream.readable) {
		throw new Error('readStream must be readable');
	}
	if (readStream.encoding === null) {
		throw new Error('readStream must have non-null encoding');
	}
	var ls = new LineStream();
	readStream.pipe(ls);
	return ls;
};

module.exports = LineStream;
util.inherits(LineStream, Stream);

function LineStream() {
	this.writable = true;
	this.readable = true;
	this.buffer = '';
}

LineStream.prototype.write = function(data, encoding) {
	if (Buffer.isBuffer(data)) {
		data = data.toString(encoding || 'utf8');
	}

	var parts = data.split(/\n/g);

	// 检测最后一个字符是否含有 \n
	var lastIndex = parts.length - 1;
	var lastItem = parts[lastIndex];

	if (lastItem && ((lastItem.length-1) === lastItem.indexOf('\n'))) {
		parts[lastIndex] += '\n';
	}
	for (var i = 0; i < parts.length; i++) {
		//console.log(parts[i],i,parts.length);
		this.emit('data', parts[i]);
	}
	//this.buffer = parts[parts.length - 1];
};

LineStream.prototype.end = function() {
	if(this.buffer.length > 0){
		this.emit('data',this.buffer);
		this.buffer = '';
	}
	this.emit('end');
};
