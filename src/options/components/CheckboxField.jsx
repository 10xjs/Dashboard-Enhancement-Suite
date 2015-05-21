var React = require('react');


var checkboxStyle = {
  flexShrink: 0,
  marginRight: '0.5em'
};

var CheckboxField = React.createClass({
  propTypes: {
    checked: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    description: React.PropTypes.string,
    name: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <label style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
        <input name={this.props.name} type="checkbox" checked={this.props.checked} onChange={this.props.onChange} style={checkboxStyle}/>
        <div>{this.props.description}</div>
      </label>
    );
  }
});

exports = module.exports = CheckboxField;