var appID = 'anfeheemhnddmckpgkcdaokkdbhkdddb';
var codebase ='https://raw.githubusercontent.com/nealgranger/Dashboard-Enhancement-Suite/master/extension.crx';
var packageJSON = require('../package.json').version;

var updateXML =
'<?xml version="1.0" encoding="UTF-8"?>' + 
'<gupdate xmlns="http://www.google.com/update2/response" protocol="2.0">' + 
'<app appid="' + appID + '">' +
'<updatecheck codebase="' + codebase + '" version="' + packageJSON.version + '" >' +
'</app>' +
'</gupdate>';

module.exports = {
  updateXML: updateXML,
  codebase: codebase,
  packageJSON: packageJSON
};