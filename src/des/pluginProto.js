var noop = function() {};

var pluginProto = {

  activate: noop,
  deactivate: noop,
  initialize: noop,

  toggle: function(option) {
    if (option) {
      this._activate(option);
    } else {
      this._deactivate(option);
    }
  },

  _toggle: function(option) {
    if (!this._testMatch()) {
      return;
    }

    return this.toggle(option);
  },

  _initialize: function(options) {
    if (!this._testMatch()) {
      return;
    }

    this._match = true;
    this._extensionId = options.extensionID;
    this.initialize();
  },

  _testMatch: function() {
    var matches;

    if (this._isMatch !== undefined) {
      return this._isMatch;
    }

    if (!this.config.matches) {
      this._isMatch = true;
      return this._isMatch;
    }

    this._isMatch = false;

    if (!Object.prototype.toString.call( this.config.matches ) === '[object Array]') {
      matches = [this.config.matches];
    } else {
      matches = this.config.matches;
    }

    for (var i = 0, len = matches.length; i < len; i++) {
      console.log('testMatch',matches[i]);
      if (location.href.match(matches[i])) {
        this._isMatch = true;
        break;
      }
    }

    return this._isMatch;
  },

  _activate: function(option) {
    if (!this._testMatch()) {
      return;
    }

    if (this._isActive) {
      return;
    }

    this.activate(option);

    this._isActive = true;
  },


  _deactivate: function(option) {
    if (!this._testMatch()) {
      return;
    }

    if (!this._isActive) {
      return;
    }

    this.deactivate(option);

    this._isActive = false;
  }
}

module.exports = pluginProto;