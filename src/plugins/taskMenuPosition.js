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
  activate: function(position) { 
    document.documentElement.classList.add('task-menu-' + position);
    this.style = this.style || require('./taskMenuPosition.css')
    this.style.use();

    this._lastPosition = position;
  },
  deactivate: function(option) {
    this.style.unuse();
  },
  toggle: function(position) {
    if (position === 'right') {
      this._deactivate();
    } else {
      document.documentElement.classList.remove('task-menu-' + this._lastPosition);
      this._activate(position);
    }
  }
};

module.exports = taskMenuPosition;