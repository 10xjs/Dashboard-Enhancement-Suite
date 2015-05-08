var React = require('react/addons');

var contextTypes = require('./FluxCoreMixin.js').contextTypes;

module.exports = React.createClass({
  displayName: 'FluxCoreComponent',

  propTypes: {
    context: React.PropTypes.object.isRequired
  },

  childContextTypes: contextTypes,

  getChildContext: function() {
    return this.props.context;
  },

  render: function() {
    return React.addons.cloneWithProps(this.props.children, {
      context: this.props.context
    });
  }
});