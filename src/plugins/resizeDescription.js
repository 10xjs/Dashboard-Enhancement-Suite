var resizeDescription = {
  config: {
    name: 'resizeDescription',
    type: 'checkbox',
    label: 'Resizable Task Description:',
    description: 'Allows vertical resizing the task description editor.'
  },
  activate: function() { 
    this.style = this.style || require('./resizeDescription.css');
    this.style.use();
  },
  deactivate: function() {
    this.style.unuse();
  }
}

module.exports = resizeDescription;