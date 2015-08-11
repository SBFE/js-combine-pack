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
	// 加入上次剩下的字符
	data = this.buffer + data;
	// 加完后清空
	this.buffer = '';
	if (-1 === data.indexOf('\n')) {
		return;
	}
	var parts = data.split(/\n/g);
	var echoStr, len;

	// 检测最后一个字符是否含有 \n
	var lastIndex = parts.length - 1;
	var lastItem = parts[lastIndex];
	// 如果最后一个字符为\n则直接输出所有字符
	if (lastItem) {
		len = lastIndex;
		this.buffer = parts[lastIndex];
	} else {
		len = parts.length;
	}

	for (var i = 0; i < len; i++) {
		echoStr = parts[i]+'\n';
		this.emit('data', echoStr);
	}
	
};

LineStream.prototype.end = function() {
	if(this.buffer.length > 0){
		this.emit('data',this.buffer);
		this.buffer = '';
	}
	
	this.emit('end');
};
