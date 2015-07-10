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
