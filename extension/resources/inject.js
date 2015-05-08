;(function(){
  var extensionId = document.currentScript.getAttribute('data-extension-id');


  console.log('loaded');

  // notifty content script that the extension is loaded
  window.postMessage({ name:'extensionLoaded' },'http://apps.caorda.com');

  // listen for options data
  window.addEventListener('message', function(event){
    switch (event.data.name) {
      case 'options':
        handleOptions(event.data.options);
        break;
    };
  });

  var disableNotificationConfirmation = new DisableNotificationConfirmation();
  var betterNav = new BetterNav();
  var betterNavDebug = new BetterNavDebug();

  // apply options
  function handleOptions(options) {
    console.log(options);

    disableNotificationConfirmation.toggle(options.disableNotificationConfirmation);
    betterNav.toggle(options.betterNav);
    betterNavDebug.toggle(options.betterNav && options.betterNavDebug);
  };




  
  /**
   *  Disable notification delete confirmations
   */
  function DisableNotificationConfirmation() {
    this._isActive = false;
    // store a reference to the orifinal confirmation function
    this.origlnkDelete_Click = window.lnkDelete_Click;
  }
  DisableNotificationConfirmation.prototype.toggle = function(active) {
    if(active) {
      this.activate();
    } else {
      this.deactivate();
    }
  };
  DisableNotificationConfirmation.prototype.activate = function() {
    if (!this._isActive) {
      this._isActive = true;
      injectStylesheet(getUrl('resources/disableNotificationConfirmation.css'));
      // override the function that dislays the confirmation
      window.lnkDelete_Click = function() {
        return true;
      };
    }
  };
  DisableNotificationConfirmation.prototype.deactivate = function() {
    if (this._isActive) {
      this._isActive = false;
      removeStylesheet(getUrl('resources/disableNotificationConfirmation.css'));
      window.lnkDelete_Click = this.origlnkDelete_Click;
    }
  };



  /**
   *  Improved animation-free nav menu
   */
  function BetterNav() {
    this._isActive = false;
  }
  BetterNav.prototype.toggle = function(active) {
    if(active) {
      this.activate();
    } else {
      this.deactivate();
    }
  };
  BetterNav.prototype.activate = function() {
    if (!this._isActive) {
      this._isActive = true;
      injectStylesheet(getUrl('resources/betterNav.css'));
    }
  };
  BetterNav.prototype.deactivate = function() {
    if (this._isActive) {
      this._isActive = false;
      removeStylesheet(getUrl('resources/betterNav.css'));
    }
  };



  /**
   *  Debug for imporoved nav menu
   */
  function BetterNavDebug() {
    this._isActive = false;
  }

  BetterNavDebug.prototype.toggle = function(active) {
    if(active) {
      this.activate();
    } else {
      this.deactivate();
    }
  };

  BetterNavDebug.prototype.activate = function() {
    if (!this._isActive) {
      this._isActive = true;
      document.documentElement.classList.add('nav-debug');
    }
  };

  BetterNavDebug.prototype.deactivate = function() {
    if (this._isActive) {
      this._isActive = false;
      document.documentElement.classList.remove('nav-debug');
    }
  };







  // utility functions
  

  function getUrl(file) {
    if (file.indexOf('/') === 0) {
      file = file.substring(1);
    }

    return 'chrome-extension://' + extensionId + '/' + file;
  }

  function injectStylesheet(src) {
    var node = document.querySelector('link[href="' + src + '"]');
    if (node) {
      return;
    }

    var link = document.createElement('link');
    link.href = src;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  function removeStylesheet(src) {
    var node = document.querySelector('link[href="' + src + '"]');
    if (node && node.parentNode) {
      console.log('remove stylesheet', node);
      node.parentNode.removeChild(node);
    }
  }

})();