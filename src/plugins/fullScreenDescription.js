var fullscreenDescription = {
  config: {
    name: 'fullscreenDescription',
    type: 'checkbox',
    label: 'Fullscreen Task Description',
    description: 'Enables the ability to view the task description in fullscreen.'
  },

  activate: function() {
    this.style = require('./fullscreenDescription.css');

    var lastItem = document.querySelector('.reToolLastItem');

    if (!lastItem) {
      return;
    }

    lastItem = lastItem.nextSibling

    this.separator = document.createElement('li');
    this.separator.className = 'reSeparator desFullscreenSeparator';
    this.separator.innerHTML = '&nbsp;';


    this.fullscreenButtonContainer = document.createElement('li');
    this.fullscreenButton = document.createElement('a');

    this.fullscreenButton.className = 'reTool desFullscreenButton';
    this.fullscreenButton.innerHTML = '<span class="Fullscreen" unselectable="on">&nbsp;</span>';

    this.fullscreenButtonContainer.appendChild(this.fullscreenButton);

    lastItem.parentNode.insertBefore(this.separator, lastItem);
    lastItem.parentNode.insertBefore(this.fullscreenButtonContainer, lastItem);

    this.fullscreenButton.addEventListener('click', this);
  },

  deactivate: function() {

    this.style.unload();

    if(this.fullscreenButton) {
      this.fullscreenButton.removeEventListener('click', this);
    }

    if (this.fullscreenButtonContainer) {
      this.fullscreenButtonContainer.parentNode.removeChild(this.fullscreenButtonContainer);
    }

    if (this.separator) {
      this.separator.parentNode.removeChild(this.separator);
    }

    document.documentElement.classList.remove('fullscreen-description');
  },

  handleEvent: function(event) {
    if (event.type === 'click') {
      event.preventDefault();
      document.documentElement.classList.toggle('fullscreen-description');
    }
  }
};

module.exports = fullscreenDescription;
