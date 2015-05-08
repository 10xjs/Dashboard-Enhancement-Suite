var React = require('react');

var OptionsContainer = require('./components/OptionsContainer.jsx');

var FluxCore = require('./core');
var FluxCoreComponent = require('./core').FluxCoreComponent;


var core = new FluxCore();
core.registerStore(require('./stores/OptionsStore.js'));
core.registerActions(require('./actions/OptionsActions.js'));


function render() {
  var renderContainer = document.getElementById('container');

  var context = core.createContext();
  
  context.executeAction('getOptions');

  chrome.storage.onChanged.addListener(function(){
    context.executeAction('getOptions');
  });

  React.render(context.createElement(React.createElement(OptionsContainer)), renderContainer);

}

render();
