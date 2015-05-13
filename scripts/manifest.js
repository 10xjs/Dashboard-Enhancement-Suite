var inherits = require('util').inherits;
var Transform = require('stream').Transform;

var manifest = require('../src/manifest');

function ManifestTransform(manifest, options) {
  Transform.call(this, options);
  this.manifest = manifest;
}
inherits(ManifestTransform, Transform);

var success;

ManifestTransform.prototype._transform = function (chunk, encoding, callback) {

  success = true;

  var description = chunk.toString();

  console.log(description);
  
  manifest.version_name = 'build ' + description;

  this.push(JSON.stringify(manifest));

  callback();
};

process.stdin.pipe(new ManifestTransform(manifest)).pipe(process.stdout);

if (!success) {
  throw new Error('No build name was provided to manifest script.');
} 