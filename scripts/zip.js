var fs = require('fs');
var path = require('path');

var archiver = require('archiver');

var outputDir = path.join(__dirname,'../build/release');

if (!fs.existsSync(outputDir)){
  fs.mkdirSync(outputDir);
}

var output = fs.createWriteStream(path.join(outputDir,'extension.zip'));
var archive = archiver('zip');

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

archive.bulk([
  { expand: true, cwd: path.join(__dirname,'../build/extension'), src: ['**/*.*'] }
]);

archive.finalize();