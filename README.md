js-combine-pack
===============

>blog ria reusable utils

##public api for node

```js
//npm install js-combine-pack
var utils = require('js-combine-pack');
var tool = utils.tool;

var toolOptions = tool.config;

toolOptions.projectName = "your project name";
toolOptions.reset = true;
toolOptions.minify = false;

```

### tool.findFiles.allFilesList([filepath])

```js
var jsList = tool.findFiles.allFilesList("test/blog7");
//List all files address list in blog7 directory

```

### tool.findFiles.allFilesCon([jsList])

```js
var jsListCon =  tool.findFiles.allFilesCon(["test/jobs/test1.js","test/jobs/test2.js"]);
//Access to the content of each item in the array

```

### tool.findFiles.confList([jsList])

```js
var confList = tool.findFiles.confList(jsList);
//To obtain a list of need to merge files

```

### tool.lineStream

```js
var lineStream = new tool.lineStream();
//reading the file in stream line;
```
### tool.depsStream

```js
var depsStream = new tool.depsStream();
// finding dependence files in stream line  ;

depsStream.pipe(lineStream, toolOptions ,confFile,jsListCon ,confList,jsDepsMap,callback);

params:
    * lineStream  //new tool.lineStream();
    * toolOptions //config option
    * confFile    //combine file
    * jsListCon   //all files content 
    * confList    //combine file list
    * jsDepsMap   //reset all files combined  
    * callback    
```
### tool.md5Cache([config],[jsListCon])

```js
var changedFile = md5Cache(toolOptions,jsListCon);
//Search for all files change, facilitate incremental packaging

```
##struction 
this utils is not perfect, continue to optimize!

## License

BSD license