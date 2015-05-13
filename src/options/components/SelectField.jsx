var React = require('react');

var selectStyle = {
  marginRight: '1em',
  flexShrink: 0
}

var SelectField = React.createClass({
  propTypes: {
    value: React.PropTypes.string,
    onChange: React.PropTypes.func,
    name: React.PropTypes.string.isRequired,
    options: React.PropTypes.array.isRequired,
    description: React.PropTypes.string
  },
  render: function() {
    var options = this.props.options.map(function(option, index){
      return <option key={index} value={option.value}>{option.label}</option>;
    });
    return (
      <div style={{ display: 'inline-flex', alignItems: 'flex-start' }}>
        <select value={this.props.value} name={this.props.name} onChange={this.props.onChange} style={selectStyle}>{options}</select>
        <label htmlFor={this.props.name}>{this.props.description}</label>
      </div>
    );
  }
});

exports = module.exports = SelectField;