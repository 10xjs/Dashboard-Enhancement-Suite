var optionsConfig = {
  betterNav: {
    type: 'checkbox',
    label: 'Improved navigation:',
    description: 'Disables menu animation and enables predictive menu aim.',
    default: true
  },
  betterNavDebug: {
    type: 'checkbox',
    description: 'Show menu aim debug margins.',
    default: false,
    require: function(options) {
      return options.betterNav;
    }
  },
  disableNotificationConfirmation: {
    type: 'checkbox',
    label: 'Disable delete confirmation:',
    description: 'Disable delete confirmation for individual notifications.',
    default: false
  },
  notificationBadges: {
    type: 'checkbox',
    label: 'Notification badges:',
    description: 'Show badges in the header and beside task names with the total number of notifactions.',
    default: false
  },
  highlightTableRows: {
    type: 'checkbox',
    label: 'Highlight Rows:',
    description: 'Highlight the current row under the mouse.',
    default: false
  },

  // flexible full width
  fullWidth: {
    type: 'checkbox',
    label: 'Full Width',
    description: 'Enable flexible full-width layout',
    default: false
  },
  taskMenuPosition: {
    type: 'select',
    label: 'Task menu position:',
    description: 'Reposition the task popup menu to prevent it from being clipped by the browser window.',
    getOptions: function() {
      return [
        { label: 'Right', value: 'right' },
        { label: 'Left', value: 'left'},
        { label: 'Automatic', value: 'auto'}
      ]
    },
    require: function(options) {
      return !options.fullWidth;
    }
  }
};