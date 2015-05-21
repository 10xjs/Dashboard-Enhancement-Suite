;(function(){
  var extensionId = document.currentScript.getAttribute('data-extension-id');
  var hasFocus = true;


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

  // page visibility
  document.addEventListener("visibilitychange", function(event){
    hasFocus = (document.visibilityState !== 'hidden');
  });

  var disableNotificationConfirmation = new DisableNotificationConfirmation();
  var betterNav = new BetterNav();
  var betterNavDebug = new BetterNavDebug();
  var fullWidth = new FullWidth();
  var notificationBadges = new NotificationBadges();

  // apply options
  function handleOptions(options) {
    console.log(options);

    disableNotificationConfirmation.toggle(options.disableNotificationConfirmation);

    betterNav.toggle(options.betterNav);

    betterNavDebug.toggle(options.betterNav && options.betterNavDebug);

    fullWidth.toggle(options.fullWidth);

    notificationBadges.toggle(options.notificationBadges);

    if (options.highlightTableRows) {
      injectStylesheet(getUrl('resources/highlightTableRows.css'));
    } else {
      removeStylesheet(getUrl('resources/highlightTableRows.css'));
    }
    
    // 
    // add addtional option handlers here
    // 
    // ex: 
    // 
    // if (options.myOption) {
    //   enableMyFeature();
    // } else {
    //   disableMyFeatrue();
    // }

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




  /**
   *  Notification count badges
   */
  function NotificationBadges() {
    this._isActive = false;
    this._notificationsUrl = '//apps.caorda.com/dashboard/notifications.aspx';
    this._frequency = 1000 * 30; //check every 30 seconds
    this._interval = null;
    this._notifications = [];
    this._observer = null; 
  }

  NotificationBadges.prototype.toggle = function(active) {
    if(active) {
      this.activate();
    } else {
      this.deactivate();
    }
  };

  NotificationBadges.prototype.activate = function() {

    var taskListContainer = document.getElementById('ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_pnlSelectAssignedPanel');

    if (!this._isActive) {
      this._isActive = true;

      injectStylesheet(getUrl('resources/notificationBadges.css'));

      this._interval = setInterval(this._fetchNotifications.bind(this), this._frequency);
      this._fetchNotifications();


      if (taskListContainer) {

        var self = this;

        this._observer = new MutationObserver(function(mutations){
          mutations.forEach(function(mutation){
            self._inject();
          });
        });

        this._observer.observe(taskListContainer, { childList: true });
      }
     
    }
  };

  NotificationBadges.prototype.deactivate = function() {
    if (this._isActive) {
      this._isActive = false;

      removeStylesheet(getUrl('resources/notificationBadges.css'));
      clearInterval(this._interval);
      this._observer && this._observer.disconnect();
    }
  };

  NotificationBadges.prototype._fetchNotifications = function(callback) {
    // TODO: remove dependancy on jQuery
    var self = this;
    jQuery.get(this._notificationsUrl, function(data) {
      var $doc = jQuery(data);
      var $notifications = $doc.find('#ctl00_plcContentPlaceHolder_grdSelect tr td:nth-child(4) a');

      var notifications = jQuery.map($notifications, function(notification) {
        return {
          taskId: notification.href.substring(notification.href.indexOf('&TaskID=') + 8),
          title: notification.parentNode.textContent.trim()
        }
      });
      self._notifications = notifications;

      self._inject();
    });
  };

  NotificationBadges.prototype._inject = function() {
    var self = this;

    // add icon to header
    var icon = document.getElementById('ctl00_lnkNotifications')

    if (self._notifications.length > 0) {
      icon.setAttribute('data-notification-count', self._notifications.length);
    } else {
      icon.removeAttribute('data-notification-count');
    }


    // add icons to task rows
    var taskRows = document.querySelectorAll('#ctl00_plcContentPlaceHolder_grdSelectAssigned .clsRow');

    if (!taskRows.length) {
      return;
    }

    var tasks = Array.prototype.map.call(taskRows, function(row){
      var href = row.querySelector('td:nth-child(5) a').href;
      return {
        id: href.substring(href.indexOf('&TaskID=') + 8),
        container: row.querySelector('td:nth-child(5) .clsOverflow')
      }
    });

    tasks.forEach(function(task) {
      var notifications = self._notifications.filter(function(notification){
        return task.id == notification.taskId;
      });

      if (notifications.length > 0) {
        task.container.setAttribute('data-notification-count', notifications.length);
      } else {
        task.container.removeAttribute('data-notification-count');
      }
    });
  };





  /**
   *  Flexible full-width layout
   */
  function FullWidth() {
    this._isActive = false;
  }

  FullWidth.prototype.toggle = function(active) {
    if(active) {
      this.activate();
    } else {
      this.deactivate();
    }
  };

  FullWidth.prototype.activate = function() {
    if (!this._isActive) {
      this._isActive = true;
      injectStylesheet(getUrl('resources/fullWidth.css'));
      var nodes = document.querySelectorAll('[style]');
      var i = nodes.length;
      while (i--) {
        var node = nodes[i];
        if (node.style.width) {
          node.setAttribute('data-inline-width',node.style.removeProperty('width'));
        }
      }
    }
  };

  FullWidth.prototype.deactivate = function() {
    if (this._isActive) {
      this._isActive = false;
      removeStylesheet(getUrl('resources/fullWidth.css'));
      var nodes = document.querySelectorAll('[data-inline-width]');
      var i = nodes.length;
      while (i--) {
        var node = nodes[i];
        node.style.width = node.getAttribute('data-inline-width');
        node.removeAttribute('data-inline-width');
      }
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




if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}