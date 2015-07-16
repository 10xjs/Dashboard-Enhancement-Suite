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