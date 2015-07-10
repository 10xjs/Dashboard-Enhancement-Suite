var pluginProto = require('./pluginProto.js');

function des(){
  this._plugins = [];
}

des.prototype.plug = function(pluginDefinition) {
  var proto = Object.assign({}, pluginProto, pluginDefinition);
  var plugin = Object.create(proto);

  this._plugins.push(plugin);
};

des.prototype.getConfig = function() {
  var config = {};

  this._plugins.forEach(function(plugin){
    config[plugin.config.name] = plugin.config;
  });

  return config;
};

des.prototype.run = function(options) {
  var extensionID = options.extensionID || '';
  var hasFocus = true;

  // notifty content script that the extension is loaded
  window.postMessage({ name:'extensionLoaded' },'http://apps.caorda.com');

  // listen for options data
  window.addEventListener('message', this.handleMessage);

  // page visibility
  document.addEventListener("visibilitychange", function(event){
    hasFocus = (document.visibilityState !== 'hidden');
  });


  this._plugins.forEach(function(plugin){
    plugin.initialize();
  });

};

des.prototype.handleMesage = function(event){
  if ('options' === event.data.name) {
    this.handleOptions(event.data.options);
  }
};

des.prototype.handleOptions = function(options) {
  this._plugins.forEach(function(plugin){
    plugin.toggle(options[plugin.config.name]);
  });
};

module.exports = des;






if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}