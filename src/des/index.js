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

des.prototype.run = function() {
  //var hasFocus = true;

  // listen for messages
  window.addEventListener('message', this.handleMessage.bind(this));

  // notifty content script that the extension is loaded
  window.postMessage({ name: 'getExtensionID' }, 'http://apps.caorda.com');

  // page visibility
  // document.addEventListener("visibilitychange", function(event){
  //   hasFocus = (document.visibilityState !== 'hidden');
  // });

};

des.prototype.handleMessage = function(event){

  var handlers = {
    extensionID: this.handleExtensionID.bind(this),
    options: this.handleOptions.bind(this),
    default: function(){}
  };

  return (handlers[event.data.name] || handlers.default)(event.data);
};

des.prototype.handleExtensionID = function(data) {

  this._plugins.forEach(function(plugin){
    var options = {
      extensionID: data.extensionID
    };
    plugin._initialize(options);
  });

  window.postMessage({ name: 'getOptions' }, 'http://apps.caorda.com');
};

des.prototype.handleOptions = function(data) {
  this._plugins.forEach(function(plugin){
    plugin._toggle(data.options[plugin.config.name]);
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