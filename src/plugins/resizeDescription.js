var resizeDescription = {
  config: {
    name: 'resizeDescription',
    type: 'checkbox',
    label: 'Resizable Task Description:',
    description: 'Allows vertical resizing the task description editor.'
  },
  activate: function() { 
    this.style = require('./resizeDescription.css');
  },
  deactivate: function() {
    this.style.unload();
  }
}

module.exports = resizeDescription;