var inherits = require('util').inherits;
var Transform = require('stream').Transform;

var manifest = require('../src/manifest');

function ManifestTransform(manifest, options) {
  Transform.call(this, options);
  this.manifest = manifest;
}
inherits(ManifestTransform, Transform);

ManifestTransform.prototype._transform = function (chunk, encoding, callback) {

  var description = chunk.toString();
  
  manifest.version_name = 'build ' + description;

  this.push(JSON.stringify(manifest));

  callback();
};

process.stdin.pipe(new ManifestTransform(manifest)).pipe(process.stdout);