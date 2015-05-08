var React = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var FluxCoreMixin = require('../core').mixin;

// components

// var UIButton = require('./UIButton.jsx');
// var Editor = require('./Editor.jsx');



var CheckBox = React.createClass({
  propTypes: {
    checked: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    label: React.PropTypes.string
  },
  render: function() {
    return (
      <label>
        <input name={this.props.name} type="checkbox" checked={this.props.checked} onChange={this.props.onChange} />
        {this.props.label}
      </label>
    );
  }
});

var OptionsContainer = React.createClass({
  mixins: [FluxCoreMixin],
  statics: {
    storeListeners: ['OptionsStore']
  },
  getState: function() {
    var optionsStore = this.context.getStore('OptionsStore');

    return {
      loading: optionsStore.isLoading(),
      betterNav: optionsStore.getOption('betterNav'),
      betterNavDebug: optionsStore.getOption('betterNavDebug'),
      disableNotificationConfirmation: optionsStore.getOption('disableNotificationConfirmation')
    };
  },

  getInitialState: function() {
    return this.getState();
  },

  onStoreChange: function() {
    this.setState(this.getState());
  },

  handleChange: function(event) {
    var option = {};

    var field = 'value';
    if (event.target.type === 'checkbox' || event.target.type === 'radio') {
      field = 'checked';
    }

    option[event.target.name] = event.target[field];
    this.context.executeAction('setOption', option);
  },
  render: function() {
    if (this.state.loading) {
      return (<div>loading options</div>);
    }

    var options = [];

    options.push(<div key="betterNav"><CheckBox name="betterNav" label="Enable improved navigation menu" checked={this.state.betterNav} onChange={this.handleChange} /></div>);

    if (this.state.betterNav) {
      options.push(<div style={{ marginLeft: 20 }} key="betterNavDebug"><CheckBox name="betterNavDebug" label="Show menu debug margins" checked={this.state.betterNavDebug} onChange={this.handleChange} /></div>);
    }

    options.push(<div key="disableNotificationConfirmation"><CheckBox name="disableNotificationConfirmation" label="Disable delete confirmation for individual notifications" checked={this.state.disableNotificationConfirmation} onChange={this.handleChange} /></div>);

  	return(
      <div>
        {options}
      </div>
    );
  }});

exports = module.exports = OptionsContainer;