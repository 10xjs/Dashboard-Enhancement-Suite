var highlightTableRows = {
  config: {
    name: 'highlightTableRows',
    type: 'checkbox',
    label: 'Highlight Rows:',
    description: 'Highlight the current row under the mouse.',
    default: false
  },
  activate: function() { 
    this.style = require('./highlightTableRows.css');
  },
  deactivate: function() {
    this.style.unload();
  }
}

module.exports = highlightTableRows;