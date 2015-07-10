var betterNav = {
  config: {
    name: 'betterNav',
    type: 'checkbox',
    label: 'Better nav menu:',
    description: 'Disables menu animation and enables predictive menu aim.',
    default: true
  },
  activate: function() { 
    this.injectStylesheet(this.getUrl('resources/betterNav.css'));
  },
  deactivate: function() {
    this.removeStylesheet(this.getUrl('resources/betterNav.css'));
  }
}

module.exports = betterNav;
