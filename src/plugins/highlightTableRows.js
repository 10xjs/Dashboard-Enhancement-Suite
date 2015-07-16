var highlightTableRows = {
  config: {
    name: 'highlightTableRows',
    type: 'checkbox',
    label: 'Highlight Rows:',
    description: 'Highlight the current row under the mouse.',
    default: false
  },
  activate: function() { 
    this.style = this.style || require('./highlightTableRows.css');
    this.style.use();
  },
  deactivate: function() {
    this.style.unuse();
  }
}

module.exports = highlightTableRows;