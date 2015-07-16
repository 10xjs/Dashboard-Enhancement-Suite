var betterNav = {
  config: {
    name: 'betterNav',
    type: 'checkbox',
    label: 'Better nav menu:',
    description: 'Disables menu animation and enables predictive menu aim.',
    default: true
  },
  activate: function() { 
    this.style = this.style || require('./betterNav.css');
    this.style.use();
  },
  deactivate: function() {
    this.style.unuse();
  }
}

module.exports = betterNav;
