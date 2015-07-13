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

  _initialize: function(options) {
    this._extensionId = options.extensionID;
    this.initialize();
  },

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
  }
}

module.exports = pluginProto;