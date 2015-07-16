var taskHistory = {
  config: {
    name: 'taskHistory',
    type: 'checkbox',
    label: 'Show history:',
    description: 'Task history and notes are always visible.'
  },
  activate: function() {
    this.style = this.style || require('./taskHistory.css');
    this.style.use();
  },
  deactivate: function() {
    this.style.unuse();
  },
}

module.exports = taskHistory;