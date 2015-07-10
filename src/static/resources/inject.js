;(function(){
  var extensionId = document.currentScript.getAttribute('data-extension-id');
  var hasFocus = true;


  console.log('loaded');

  // notifty content script that the extension is loaded
  window.postMessage({ name:'extensionLoaded' },'http://apps.caorda.com');

  // listen for options data
  window.addEventListener('message', function(event){
    if ('options' === event.data.name) {
      handleOptions(event.data.options);
    }
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
  var fullscreenDescription = new FullscreenDescription();
  var attachmentThumbs = new AttachmentThumbs();

  // apply options
  function handleOptions(options) {
    console.log(options);

    disableNotificationConfirmation.toggle(options.disableNotificationConfirmation);

    betterNav.toggle(options.betterNav);

    betterNavDebug.toggle(options.betterNav && options.betterNavDebug);

    fullWidth.toggle(options.fullWidth);

    notificationBadges.toggle(options.notificationBadges);

    fullscreenDescription.toggle(options.fullscreenDescription);


    attachmentThumbs.activate();

    if (options.highlightTableRows) {
      injectStylesheet(getUrl('resources/highlightTableRows.css'));
    } else {
      removeStylesheet(getUrl('resources/highlightTableRows.css'));
    }
    
    switch (options.taskMenuPosition) {
      case 'left':
        document.documentElement.classList.add('task-menu-left');
        document.documentElement.classList.remove('task-menu-auto');
        injectStylesheet(getUrl('resources/taskMenuPosition.css'));
        break;
      case 'auto':
        document.documentElement.classList.add('task-menu-auto');
        document.documentElement.classList.remove('task-menu-left');
        injectStylesheet(getUrl('resources/taskMenuPosition.css'));
        break;
      default:
        document.documentElement.classList.remove('task-menu-left');
        document.documentElement.classList.remove('task-menu-auto');
        removeStylesheet(getUrl('resources/taskMenuPosition.css'));
    }
    
    if (options.resizeDescription) {
      injectStylesheet(getUrl('resources/resizeDescription.css'));
    } else {
      removeStylesheet(getUrl('resources/resizeDescription.css'));
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

  function FullscreenDescription() {
    this._isActive = false;
  }

  FullscreenDescription.prototype.toggle = function(active) {
    if(active) {
      this.activate();
    } else {
      this.deactivate();
    }
  };

  FullscreenDescription.prototype.activate = function() {
    if (this._isActive) {
      return;
    }
    this._isActive = true;

    injectStylesheet(getUrl('resources/fullscreenDescription.css'));

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
  };

  FullscreenDescription.prototype.deactivate = function() {
    if (!this._isActive) {
      return;
    }
    this._isActive = false;

    removeStylesheet(getUrl('resources/fullscreenDescription.css'));

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
  };

  FullscreenDescription.prototype.handleEvent = function(event) {
    if (event.type === 'click') {
      event.preventDefault();
      document.documentElement.classList.toggle('fullscreen-description');
    }
  };







  function AttachmentThumbs() {
    this._isActive = false;
  }

  AttachmentThumbs.prototype.toggle = function(active) {
    if(active) {
      this.activate();
    } else {
      this.deactivate();
    }
  };
  AttachmentThumbs.prototype.activate = function() {
    if (!this._isActive) {
      this._isActive = true;

      var container = document.querySelector('#ctl00_plcContentPlaceHolder_pnlProperties > p + .clsContainer');

      if (!container) {
        return;
      }

      injectScript('https://raw.githubusercontent.com/cbopp-art/lightcase/master/lightcase.min.js');
      injectStylesheet('https://raw.githubusercontent.com/cbopp-art/lightcase/master/css/lightcase.css');

      // this.gridContainer = document.createElement('div');
      // this.gridContainer.className = 'des-attachment-grid';

      // container.appendChild(this.gridContainer);

      // var files = this.parseFiles();

      // files.forEach(function(file) {
      //   var extIndex = file.name.lastIndexOf('.');
      //   var ext = '';

      //   if (extIndex > 0) {
      //     ext = file.name.substring(extIndex + 1);
      //   }

      //   var attachment = document.createElement('a');
      //   attachment.className = 'des-attachment';

      //   attachment.setAttribute('data-href', file.path);

      //   var downloadLink = document.createElement('a');
      //   downloadLink.className = 'des-attachment-download'
      //   downloadLink.innerHTML = downloadLink.title = 'Download Attachment';
      //   downloadLink.href = file.path;

      //   var viewLink = document.createElement('a');
      //   viewLink.className = 'des-attachment-view';
      //   viewLink.innerHTML = viewLink.title = 'Preview Attachment';
      //   downloadLink.href = file.path;

      //   if (ext.match(/bmp|gif|jpeg|jpg|png|tif|tiff/)) {
      //     attachment.classList.add('des-attachment-viewable des-attachment-image');


      //   }

      //   if (ext.match(/pdf/)) {
      //     attachment.classList.add('des-attachment-viewable des-attachment-pdf');
      //   }


      // });

    }
  };
  AttachmentThumbs.prototype.deactivate = function() {
    if (this._isActive) {
      this._isActive = false;

    }
  };
  AttachmentThumbs.prototype.parseFiles = function() {
    var fileRows = document.querySelectorAll('#ctl00_plcContentPlaceHolder_grdTaskFiles tr:nth-child(n+2)');

    var files = Array.prototype.map.call(fileRows, function(row) {
      return {
        date: row.querySelector('td:nth-child(1)').textContent.trim(),
        name: row.querySelector('td:nth-child(2)').textContent.trim(),
        creator: row.querySelector('td:nth-child(3)').textContent.trim(),
        path: row.querySelector('td:nth-child(4) a[id$="_lnkView"]').href
      };
    });

    return files;
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

  function injectScript(src) {
    if (document.querySelector('script[src="' + src + '"]')) {
      return;
    }

    var script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }

  function removeScript(src) {
    var node = document.querySelector('script[src="' + src + '"]');
    if (node && node.parentNode) {
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