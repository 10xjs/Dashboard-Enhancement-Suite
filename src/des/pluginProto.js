var noop = function() {};

var pluginProto = {
  toggle: function(option) {
    if(option) {
      this._activate(option);
    } else {
      this._deactivate(option);
    }
  },

  activate: noop,
  deactivate: noop,
  initialize: noop,

  _activate: function(option) {
    if (this._isActive) {
      return;
    }

    this.activate(option);

    this._isActive = true;
  },


  _deactivate: function(option) {
    if (!this._isActive) {
      return;
    }

    this.deactivate(option);

    this._isActive = false;
  },

  injectStylesheet: function(src) {
    var node = document.querySelector('link[href="' + src + '"]');
    if (node) {
      return;
    }

    var link = document.createElement('link');
    link.href = src;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  },

  removeStylesheet: function(src) {
    var node = document.querySelector('link[href="' + src + '"]');
    if (node && node.parentNode) {
      console.log('remove stylesheet', node);
      node.parentNode.removeChild(node);
    }
  },

  injectScript: function(src) {
    if (document.querySelector('script[src="' + src + '"]')) {
      return;
    }

    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.body.appendChild(script);
  },

  removeScript: function(src) {
    var node = document.querySelector('script[src="' + src + '"]');
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  },

  getUrl: function (file) {
    if (file.indexOf('/') === 0) {
      file = file.substring(1);
    }

    return 'chrome-extension://' + extensionId + '/' + file;
  }

}

module.exports = pluginProto;