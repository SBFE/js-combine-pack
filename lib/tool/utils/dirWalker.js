(function(){
	var fs = require('fs');
	var path = require('path');

	function walk(uri,filter,files){
		var stat = fs.lstatSync(uri);
		if(filter(uri)){
			if(stat.isFile()){
				uri = path.resolve(uri);
				// console.log(uri);
				switch(path.extname(uri)){
					case '.js':
						files.js.push(uri);
						break;
					case  '.css':
						files.css.push(uri);
						break;
				}
			}
			if(stat.isDirectory()){
				fs.readdirSync(uri).forEach(function(part){
					walk(path.join(uri,part),filter,files)
				});
			}
		}
		stat = null;
	}

	function defaultFilter(uri){
		var start = path.basename(uri).charAt(0);
		if(start === '.'){
			start = null;
			return false;
		}
		return true;
	}

	module.exports = function(rootDir,filter){
		filter = filter || defaultFilter;
		var files = {
			js:[],
			css:[]
		};
		walk(rootDir,filter,files);
		return files;
	};
})();
