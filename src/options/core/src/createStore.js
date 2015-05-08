var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var storeProtoype = {
  handlers: {},
  _handleEvent: function(event) {
    var self = this;
    Object.keys(this.handlers).forEach(function(eventName){
      if (eventName === event.eventName) {
        var handler = self[self.handlers[eventName]];
        if ('function' === typeof handler) {
          return handler.call(self, event.payload);
        }
      }
    });
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  initialize: function() {}
};


exports = module.exports = function(storeName,storeDefinition) {

  function Store(context) {
    EventEmitter.call(this);
    this.context = context;
    this.initialize();
  }

  Store.storeName = storeName;

  assign(Store.prototype, EventEmitter.prototype, storeProtoype, storeDefinition);

  return Store;
}