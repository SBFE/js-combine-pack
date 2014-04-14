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
toolOptions.basedir = "rootdir";
```

### tool.findFiles.allFilesList(filedir)

```js
var jsList = tool.findFiles.allFilesList("test/blog7");
//List all files address list in blog7 directory

```

### tool.findFiles.allFilesCon(jsList)

```js
var jsListCon =  tool.findFiles.allFilesCon(["test/jobs/test1.js","test/jobs/test2.js"]);
//Access to the content of each item in the array

```
### tool.findJsAllImport(filedir,allFilesCon,callback)

```js
var findJsAllImport = tool.findJsAllImport(filedir,allFilesCon,callback);
//Search for all files change, facilitate incremental packaging

```
##struction 
this utils is not perfect, continue to optimize!

## License

BSD license