;(function(){
  var domain = 'http://apps.caorda.com';

  var scriptTag = document.createElement('script');
  scriptTag.src = chrome.extension.getURL('/inject.js');
  scriptTag.setAttribute('data-extension-id', chrome.runtime.id);
  scriptTag.type = 'text/javascript';
  document.body.appendChild(scriptTag);

  var getOptions = function() {
    chrome.storage.sync.get(null, function(options){
      window.postMessage({ name:'options', extensionID: chrome.runtime.id, options: options }, domain);
    });
  }

  var getExtensionID = function() {
    window.postMessage({ name:'extensionID', extensionID: chrome.runtime.id }, domain);
  }

  window.addEventListener('message', function(event){
    var handlers = {
      getExtensionID: getExtensionID,
      getOptions: getOptions,
      default: function(){}
    };

    return (handlers[event.data.name] || handlers.default)(event.data);
  })
  
  chrome.storage.onChanged.addListener(getOptions);
})();

