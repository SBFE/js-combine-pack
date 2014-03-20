var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

module.exports = function(config,jsMap){
	var cacheMap = {};
	var cacheMapUrl = config.cacheMapUrl;
	var modified = [];
	if(!path.existsSync(cacheMapUrl)){
		for(var i in jsMap){
			cacheMap[i] = crypto.createHash('md5').update(jsMap[i]).digest('hex');
		}
		fs.writeFileSync(cacheMapUrl,JSON.stringify(cacheMap));
		return false;
	}else{
		var md5Cache = JSON.parse(fs.readFileSync(cacheMapUrl,'utf-8'));
		for(var i in jsMap){
			var md5 = crypto.createHash('md5').update(jsMap[i]).digest('hex');
			if(md5 != md5Cache[i]){
				md5Cache[i] = md5;
				modified.push(i);
			}
		}
		fs.writeFileSync(cacheMapUrl,JSON.stringify(md5Cache));
		return modified;
	}
}
