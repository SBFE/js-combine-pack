var Stream = require('stream').Stream,
	util = require('util'),
	path = require('path'),
	fs = require('fs');

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
	var that = this;
	if (Buffer.isBuffer(data)) {
		data = data.toString(encoding || 'utf8');
	}
	/*this.buffer += data;
	var results;
	while(results = /^([^\n]*\n)/.exec(this.buffer)){
		var this_line = results[1];
		this.buffer = this.buffer.slice(this_line.length);
		this.emit('data',this_line);
	}*/
	var parts = data.split(/\n/g);

	if (this.buffer.length > 0) {
		parts[0] = this.buffer + parts[0];
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
