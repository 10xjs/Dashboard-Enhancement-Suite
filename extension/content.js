;(function(){
  var domain = 'http://apps.caorda.com';

  chrome.storage.sync.set({ nealIsAwesome: true });

  var scriptTag = document.createElement('script');
  scriptTag.src = chrome.extension.getURL('/resources/inject.js');
  scriptTag.setAttribute('data-extension-id', chrome.runtime.id);
  scriptTag.type = 'text/javascript';
  document.body.appendChild(scriptTag);

  var getOptions = function() {
    chrome.storage.sync.get(null, function(options){
      window.postMessage({ name:'options', options: options },domain);
    });
  }


  window.addEventListener('message', function(event){
    switch (event.data.name) {
      case 'extensionLoaded':
        getOptions()
        break;
    }
  })

  chrome.storage.onChanged.addListener(getOptions);

})();

