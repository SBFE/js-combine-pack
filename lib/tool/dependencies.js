var fs = require('fs');
var path = require('path');
var byline = require('./lineStream');
var dStream = require('./depsStream');

var loadDeps = function(config,confList,jsMap,jsDepsMap){
	//confList = confList.slice(0,1);
	if(confList && confList.length){
		var confFile = confList.shift();

		var lineStream = new byline();
		var depsStream  = new dStream();

		var confStream = fs.createReadStream(path.join(config.baseUrl,confFile));
		confStream.pipe(lineStream);
		//lineStream.pipe(process.stdout);
		lineStream.pipe(depsStream);
		// console.log('111' + JSON.stringify(jsDepsMap));
		depsStream.pipe(lineStream,config,confFile,jsMap,confList,jsDepsMap,loadDeps);
	}
};

module.exports = function(config,changedFile,confList,jsMap){
	if(changedFile === false){
		var jsDepsMap = {};
		confList.forEach(function(value,key){	
			confList[key] = value.replace(config.baseUrl,'');
		});
		loadDeps(config,confList,jsMap,jsDepsMap);
	}else{
		var combineList = [];
		var jsDepsMap = JSON.parse(fs.readFileSync(config.depsMapUrl,'utf-8'));
		changedFile.forEach(function(value){
			if(jsDepsMap[value]){
				combineList.push(value);
			}
			for(var i in jsDepsMap){
				if(jsDepsMap[i].indexOf(value) >=0){
					if(combineList.indexOf(i) < 0){
						combineList.push(i);
					}
				}
			}
		});
		loadDeps(config,combineList,jsMap,jsDepsMap);
	}
};
