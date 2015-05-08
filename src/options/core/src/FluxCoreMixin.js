var React = require('react');

module.exports = {
  contextTypes: {
    getStore: React.PropTypes.func.isRequired,
    getAction: React.PropTypes.func.isRequired,
    executeAction: React.PropTypes.func.isRequired
  },

  componentDidMount: function() {
    var listeners = this.constructor.storeListeners || [];
    for (var i = 0, len = listeners.length; i < len; i ++) {
      var store = this.context.getStore(listeners[i]);

      if (store) {
        store.addChangeListener(this.onStoreChange);
      }
    }
  },

  componentWillUnmount: function() {
    var listeners = this.constructor.storeListeners || [];
    for (var i = 0, len = listeners.length; i < len; i ++) {
      var store = this.context.getStore(listeners[i]);

      if (store) {
        store.removeChangeListener(this.onStoreChange);
      }
    }
  }
};