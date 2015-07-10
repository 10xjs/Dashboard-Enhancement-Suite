var taskMenuPosition = {
  config: {
    name: 'taskMenuPosition',
    type: 'select',
    label: 'Task menu position:',
    description: 'Reposition the task popup menu to prevent it from being clipped by the browser window.',
    getOptions: function() {
      return [
        { label: 'Right', value: 'right' },
        { label: 'Left', value: 'left'},
        { label: 'Automatic', value: 'auto'}
      ]
    }
  },
  activate: function(option) { 
    this.position = option;
    document.documentElement.classList.add('task-menu-' + this.position);
    this.injectStylesheet(this.getUrl('resources/taskMenuPosition.css'));
  },
  deactivate: function(option) {
    document.documentElement.classList.remove('task-menu-' + this.position);
    this.removeStylesheet(this.getUrl('resources/taskMenuPosition.css'));
  },
  toggle: function(option) {
    if (option === 'right') {
      this._deactivate(option);
    } else {
      this._deactivate(option);
      this._activate(option);
    }
  }
};

module.exports = taskMenuPosition;