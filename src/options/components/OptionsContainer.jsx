var React = require('react/addons');
var LinkedStateMixin = React.addons.LinkedStateMixin;

var FluxCoreMixin = require('../core').mixin;

var OptionRow = require('./OptionRow.jsx');
var CheckboxField = require('./CheckboxField.jsx');
var SelectField = require('./SelectField.jsx');


var OptionsList = React.createClass({
  mixins: [FluxCoreMixin],
  propTypes: {
    options: React.PropTypes.object.isRequired,
    config: React.PropTypes.object.isRequired
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
    var self = this;

    var fields = Object.keys(this.props.options).map(function(option){
      var config = self.props.config[option];
      var value = self.props.options[option];
      var content;

      // check for and run the require function by passing the current state
      if ('function' === typeof config.require && !config.require(self.props.options)){
        // requirements are not met, dot not render this field
        return;
      }

      switch(config.type) {
        case 'checkbox':
          return (
            <OptionRow key={option} label={config.label}>
              <CheckboxField checked={value} name={option} description={config.description} onChange={self.handleChange} />
            </OptionRow>
          );
          break;
        case 'select':
          return (
            <OptionRow key={option} label={config.label}>
              <SelectField value={value} name={option} onChange={self.handleChange} description={config.description} options={config.getOptions(self.props.options)} />
            </OptionRow>
          );
          break;
        default:
          return (
            <OptionRow key={option} label={config.label}>
              option type: {config.type} is not yet supported
            </OptionRow>
          );
          break;
      }
    });

    return (
      <div>{fields}</div>
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
      options: optionsStore.getOptions(),
      config: optionsStore.getConfig(),
      manifest: optionsStore.getManifest()
    };
  },

  getInitialState: function() {
    return this.getState();
  },

  onStoreChange: function() {
    this.setState(this.getState());
  },
  render: function() {
    var content;

    if (this.state.loading) {
      content = <div>loading options</div>;
    } else {
      content = <OptionsList options={this.state.options} config={this.state.config} />
    }

    return (
      <div>
        <h2 style={{ whiteSpace: 'nowrap' }}>{this.state.manifest.name} <small>v{this.state.manifest.version}</small></h2>
        {content}
        <p style={{ color: '#888', float: 'left'}}>{this.state.manifest.version_name}</p>
      </div>
    );
  }});

exports = module.exports = OptionsContainer;