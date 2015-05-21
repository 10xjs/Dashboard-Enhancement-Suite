var assign = require('object-assign');

var FluxCoreComponent = require('./FluxCoreComponent.js');
var FluxCoreContext = require('./FluxCoreContext.js');
var mixin = require('./FluxCoreMixin.js')

var createStore = require('./createStore.js');

exports = module.exports = FluxCore;

exports.FluxCoreComponent = FluxCoreComponent;
exports.FluxCoreContext = FluxCoreContext;
exports.createStore = createStore;
exports.mixin = mixin;

/**
 * FluxCore
 * @class
 */
function FluxCore() {
  this.stores = {};
  this.actions = {};
  this.plugins = [];
};

exports.prototype.createContext = function() {
  return new FluxCoreContext(this);
};

exports.prototype.plug = function(plugin) {
  this.plugins.push(plugin);
};

/**
 * register a store constructor
 * 
 * @param  {function} StoreConstructor a consructor returned from createStore()
 */
exports.prototype.registerStore = function(StoreConstructor) {
  var storeName = StoreConstructor.storeName;

  if (! storeName) {
    console.warn('Cannot register store without name');
  }

  if (this.stores[storeName]) {
    console.warn('Cannot redefine store: ' + storeName);
    return;
  }

  this.stores[storeName] = StoreConstructor;
};


/**
 * register an action creator
 * 
 * @param  {[type]} action action returned by createAction
 */
exports.prototype.registerAction = function(actionName, action) {
  if(arguments.length === 1) {
    action = actionName;
    actionName = action.actionName;
  } else {
    action.actionName = actionName;
  }

  if(this.actions[actionName]) {
    console.warn('Cannot redefine action: ' + actionName);
    return;
  }

  this.actions[actionName] = action;
};

exports.prototype.registerActions = function(actions) {
  var self = this;
  Object.keys(actions).forEach(function(actionName){
    self.registerAction(actionName, actions[actionName])
  });
};


