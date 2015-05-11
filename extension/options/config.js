var optionsConfig = {
  betterNav: {
    type: 'checkbox',
    label: 'Enable improved navigation menu.',
    default: false
  },
  betterNavDebug: {
    type: 'checkbox',
    label: 'Show menu aim debug margins.',
    default: false,
    require: function(options) {
      return options.betterNav;
    }
  },
  disableNotificationConfirmation: {
    type: 'checkbox',
    label: 'Disable delete confirmation for individual notifications.',
    default: false
  },
  notificationBadges: {
    type: 'checkbox',
    label: 'Show additional notification count badges.',
    default: false
  }
};