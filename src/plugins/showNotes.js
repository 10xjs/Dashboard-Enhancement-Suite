var showNotes = {
  config: {
    name: 'showNotes',
    type: 'checkbox',
    label: 'Always show task notes:',
    description: 'The task history panel will always be open with notes visible.',
    default: false
  },
  activate: function() { 
    this.injectStylesheet(this.getUrl('resources/showNotes.css'));
  },
  deactivate: function() {
    this.removeStylesheet(this.getUrl('resources/showNotes.css'));
  }
}

module.exports = showNotes;
