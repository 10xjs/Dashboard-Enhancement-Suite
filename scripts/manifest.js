var inherits = require('util').inherits;
var Transform = require('stream').Transform;

var manifest = require('../src/manifest');

function ManifestTransform(manifest, options) {
  Transform.call(this, options);
  this.manifest = manifest;
}
inherits(ManifestTransform, Transform);

ManifestTransform.prototype._transform = function (chunk, encoding, callback) {
  
  manifest.version_name = 'build ' + chunk.toString();

  this.push(JSON.stringify(manifest));

  callback();
};

process.stdin.pipe(new ManifestTransform(manifest)).pipe(process.stdout);