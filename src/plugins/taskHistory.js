var taskHistory = {
  config: {
    name: 'taskHistory',
    type: 'checkbox',
    label: 'Show history:',
    description: 'Task history and notes are always visible.'
  },
  activate: function() {
    this.style = require('./taskHistory.css');
  },
  deactivate: function() {
    this.style.unload();
  },
}

module.exports = taskHistory;