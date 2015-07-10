var resizeDescription = {
  config: {
    name: 'resizeDescription',
    type: 'checkbox',
    label: 'Resizable Task Description',
    description: 'Allows vertical resizing the task description editor.'
  },
  activate: function() { 
    this.injectStylesheet(this.getUrl('resources/resizeDescription.css'));
  },
  deactivate: function() {
    this.removeStylesheet(this.getUrl('resources/resizeDescription.css'));
  }
}

module.exports = resizeDescription;