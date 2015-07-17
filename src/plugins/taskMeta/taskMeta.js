// var sanitizeHtml = require('sanitize-html');

var taskMeta = {
  config: {
    name: 'taskMeta',
    type: 'checkbox',
    label: 'Enable task metadata:',
    description: 'Allows arbitratry metadata to be stored using a task\'s description.',
    matches: '//apps.caorda.com/dashboard/tasks/tasks.aspx?Action=LoadTask'
  },
  activate: function() {
    window.meta = this;
    console.log('meta', window.meta);
  },
  deactivate: function() {
  },
  parseFiles: function() {
  },
  loadData: function() {
    var description = document.getElementById('ctl00_plcContentPlaceHolder_radEditorDescription_contentIframe');
    var savedMeta = description.contentDocument.querySelector('div[data-des-meta]');

    if (savedMeta) {
      try {
        this._data = JSON.parse(savedMeta.getAttribute('data-des-meta'));
      } catch (e) {
        console.err(e);
      }
    } else {
      this._data = {};
    }

    return this._data;
  },
  saveData: function(data) {
    if (data) {
      this._data = data;
    }
    var description = document.getElementById('ctl00_plcContentPlaceHolder_radEditorDescription_contentIframe');
    var savedMeta = description.contentDocument.querySelector('div[data-des-meta]');

    if (!savedMeta) {
      savedMeta =  description.contentDocument.createElement('div');
    }

    try {
      savedMeta.setAttribute('data-des-meta',JSON.stringify(this._data));
    } catch (e) {
      console.err(e);
    }

    description.contentDocument.body.appendChild(savedMeta);

  }
}

module.exports = taskMeta;


function TaskMeta(options) {
  this._dataElementId = options.dataElementID || 'DES_TASK_META';
  this._dataAttribute = options.dataAttribute || 'data-des-meta';

  this._data = {};
};

TaskMeta.prototype.parse = function(encoded) {
};

TaskMeta.prototype.encode = function() {
  var dataJSON = JSON.stringify(this._data);
  var encoded = '<!--' + this._delimeters.begin + dataJSON + this._delimeters.end + '-->';
  return encoded;
};

TaskMeta.prototype.sanitizeValue = function(value) {
  value = sanitizeHtml(value);
  value = value.replace('-->', '-- >');
  return value;
};

TaskMeta.prototype.sanitizeKey = function(key) {
  key = key.replace('-->', '-- >');
  return key;
};

TaskMeta.prototype.set = function(key, value) {
  value = this.sanitizeValue(value);
  key = this.sanitizeKey(key);
  this._data[key] = value;
};

TaskMeta.prototype.get = function(key) {
  return this._data[key];
};
