var betterNav = {
  config: {
    name: 'betterNav',
    type: 'checkbox',
    label: 'Better nav menu:',
    description: 'Disables menu animation and enables predictive menu aim.',
    default: true
  },
  activate: function() { 
    this.style = require('./betterNav.css');
  },
  deactivate: function() {
    this.style.unload();
  }
}

module.exports = betterNav;
