var React = require('react');


var rowStyle = {
  marginBottom: '1em',
  display: 'flex'
}

var labelStyle = {
  width: '15em',
  flexShrink: 0,
  marginRight: '1em',
  textAlign: 'right',
  fontWeight: 'bold'
};

var inputStyle = {
  width: '30em',
  flexShrink: 0
};

var OptionRow = React.createClass({
  propTypes: {
    label: React.PropTypes.string
  },
  render: function() {
    return (
      <div style={rowStyle}>
        <div style={labelStyle}><label>{this.props.label}</label></div>
        <div style={inputStyle}>{this.props.children}</div>
      </div>
    );
  }
});

exports = module.exports = OptionRow;