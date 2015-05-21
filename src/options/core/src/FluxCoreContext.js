var Dispatcher = require('flux').Dispatcher;
var React = require('react');

var FluxCoreComponent = require('./FluxCoreComponent.js');


exports = module.exports = FluxCoreContext;

function FluxCoreContext(core) {
  this.core = core;

  this._storeInstances = Object.create(null);

  this.dispatcher = new Dispatcher();

  this._storeContext = null;
  this._componentContext = null;
  this._actionContext = null;
}

exports.prototype.createElement = function(children) {
 return React.createElement(FluxCoreComponent,{ context: this.getComponentContext()}, children);
}

exports.prototype.getDispatcher = function() {
  console.warn('getDispatcher is depricated');
  return this.dispatcher;
};

exports.prototype.dispatch = function(eventName, payload) {
  var self = this;

  // check for stores that listen to this event and ensure
  // that an instance exists
  Object.keys(this.core.stores).forEach(function(storeName){
    var storeProto = self.core.stores[storeName].prototype;
    if (storeProto.handlers[eventName]) {
      if (self._storeInstances[storeName]) {
        return;
      }
      self.getStore(storeName);
    }
  });

  this.dispatcher.dispatch({
    eventName: eventName,
    payload: payload
  });
};


/**
 * get the instance of a store by name
 * 
 * Creates an instance of the registred store if one
 * does not already exist. Returns the found or created
 * instance.
 * 
 * Returns null if the requested store is not registered.
 * 
 * @param  {string} storeName the name of the store
 * @return {object}
 */
exports.prototype.getStore = function(storeName) {
  if (!this._storeInstances[storeName]) {
    var StoreConstructor = this.core.stores[storeName];

    if (!StoreConstructor) {
      console.warn('The store: ' + storeName + ' has not been registered.')
      return null;
    }

    var store = new StoreConstructor(this.getStoreContext());

    this.dispatcher.register(store._handleEvent.bind(store));

    this._storeInstances[storeName] = store;
  }

  return this._storeInstances[storeName];
};


/**
 * Get a registered action by name.
 *
 * Returns null if the requested action is not registered.
 * 
 * @param  {string} actionName the name of a registered action
 * @return {function}           
 */
exports.prototype.getAction = function(actionName) {
  var action = this.core.actions[actionName];

  if (! action) {
    console.warn('The action: ' + actionName + ' has not been registered.')
    return null;
  }

  return action;
};

exports.prototype.executeAction = function(action, payload, callback) {
  if (arguments.length === 2 && 'function' === typeof payload) {
    callback = payload;
    payload = null;
  }

  if ('[object String]' === Object.prototype.toString.call(action)) {
    action = this.getAction(action);
  }

  action.call(action, this.getActionContext(), payload, function(err) {
    callback && callback.apply(callback, arguments);
  });
};


exports.prototype.getStoreContext = function() {
  if (!this._storeContext) {
    this._storeContext = {
      getStore: this.getStore.bind(this),
      getAction: this.getAction.bind(this),
      executeAction: this.executeAction.bind(this)
    };
  }

  return this._storeContext;
};

exports.prototype.getComponentContext = function() {
  if (!this._componentContext) {
    this._componentContext = {
      getStore: this.getStore.bind(this),
      getAction: this.getAction.bind(this),
      executeAction: this.executeAction.bind(this)
    };
  }

  return this._componentContext;
};

exports.prototype.getActionContext = function() {
  if (!this._actionContext) {
    this._actionContext = { 
      dispatch: this.dispatch.bind(this)
    };
  }
  return this._actionContext;
};

