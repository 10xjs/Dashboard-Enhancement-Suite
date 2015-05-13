var fs = require('fs');
var path = require('path');

var paths = {
  src: path.join(__dirname,'../src/extension'),
  dest: path.join(__dirname,'../dev/extension')
};

if (!fs.existsSync(paths.dest)){
  fs.mkdirSync(paths.dest);
}


/**
 * Create a matching directory structure at destination path
 * with symlinks to all of the src path files
 * @param  {[type]} paths [description]
 * @return {[type]}       [description]
 */
function deepLinkDir(paths) {

  fs.readdir(paths.src,function(err, files){

    if (err) {
      throw err;
    }

    files.forEach(function(file){

      // add the current file/directory to the path
      var files = {
        src: path.join(paths.src, file),
        dest: path.join(paths.dest, file)
      };

      // determine if the source path is a directory
      var isDirectory = fs.lstatSync(files.src).isDirectory();

      if (isDirectory) {
        // if source path is a directory,
        // create matching destination directory
        console.log('dir %s', files.dest);
        fs.mkdirSync(files.dest);
        deepLinkDir(files);
      } else {
        // if source path is file create a symlink
        console.log('lnk %s', files.dest);
        fs.symlinkSync(files.src, files.dest);
      }

    });

  });

}

deepLinkDir(paths);