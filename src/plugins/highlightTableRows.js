var highlightTableRows = {
  config: {
    name: 'highlightTableRows',
    type: 'checkbox',
    label: 'Highlight Rows:',
    description: 'Highlight the current row under the mouse.',
    default: false
  },
  activate: function() { 
    this.injectStylesheet(this.getUrl('resources/highlightTableRows.css'));
  },
  deactivate: function() {
    this.removeStylesheet(this.getUrl('resources/highlightTableRows.css'));
  }
}

module.exports = highlightTableRows;