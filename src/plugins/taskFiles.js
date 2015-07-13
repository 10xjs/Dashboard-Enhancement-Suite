
var taskFiles = {
  config: {
    name: 'taskFiles',
    type: 'checkbox',
    label: 'Better task files:',
    description: 'Task files are always visible. Adds the option to view or download task files.'
  },
  activate: function() {
    this.style = require('./taskFiles.css');

    var container = document.querySelector('#ctl00_plcContentPlaceHolder_pnlProperties > p + .clsContainer');

    if (!container) {
      return;
    }

    var lightcase = require('lightcase');
    var lightcaseStyle = require('../../node_modules/lightcase/css/lightcase.css');

    jQuery('#ctl00_plcContentPlaceHolder_grdTaskFiles a[id$=_lnkView]')
    .attr('target','_blank')
    .each(function(){
        var download = document.createElement('a');
        var cell = document.createElement('td');

        download.href = this.href
        download.innerHTML = 'Download';


        cell.appendChild(download);
        this.parentNode.parentNode.insertBefore(cell, this.parentNode);

        this.href += '?view';
    })
    .lightcase({
        maxWidth: '100%',
        maxHeight: '100%',
        disableShrink: true
    });

  },
  deactivate: function() {
    this.style.unload();
  },
  parseFiles: function() {
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

  }
}

module.exports = taskFiles;