var fs = require('fs');
var path = require('path');
var manifest = require('../src/manifest');

var manifestJSON = JSON.stringify(manifest);

console.log(manifestJSON);

fs.writeFileSync(path.join(__dirname,'../build/extension/manifest.json'), manifestJSON);