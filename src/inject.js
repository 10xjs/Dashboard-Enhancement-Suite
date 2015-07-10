var extension = require('./extension.js');

extension.run({ extensionID: document.currentScript.getAttribute('data-extension-id') });