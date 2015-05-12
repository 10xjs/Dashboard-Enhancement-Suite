var fs = require('fs');
var path = require('path');
var manifest = require('../src/manifest');

manifest.name = manifest.name + ' - dev build';

var manifestJSON = JSON.stringify(manifest);

console.log(manifestJSON);

fs.writeFileSync(path.join(__dirname,'../dev/extension/manifest.json'), manifestJSON);