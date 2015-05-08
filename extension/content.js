;(function(){
  var domain = 'http://apps.caorda.com';

  chrome.storage.sync.set({ nealIsAwesome: true });

  //document.addEventListener('readystatechange', function(){
    //if(document.readyState === 'interactive') {
      var scriptTag = document.createElement('script');
      scriptTag.src = chrome.extension.getURL('/resources/inject.js');
      scriptTag.setAttribute('data-extension-id', chrome.runtime.id);
      scriptTag.type = 'text/javascript';
      document.body.appendChild(scriptTag);
    //}
 // });

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


  // addEventListener('getDesOptions', getOptions);
  chrome.storage.onChanged.addListener(getOptions);

  // access layer for page interaction
  // var extension = new Extension;

  // // load fixes
  // var dnc = new DisableNotificationConfirmation(extension, {
  //   containerId: 'ctl00_plcContentPlaceHolder_ctl00_plcContentPlaceHolder_radAjaxPanelNotificationsPanel',
  //   className: 'confirmation-disabled',
  //   script: { id: 'notifications', src: chrome.extension.getURL('src/resources/disableNotificationConfirmation.js') }
  // });

  // var betterNav = new BetterNav(extension, {
  //   styleSheet: { id: 'betterNav', src: chrome.extension.getURL('src/resources/betterNav.css') }
  // });

  // var navDebug = new NavDebug(extension, {
  //   className: 'nav-debug'
  // });


  // function getOption(option, callback) {
  //   chrome.storage.sync.get(option, function(results){
  //     callback(results[option]);
  //   });
  // }

  // // inject fixes into the page based on options
  // function inject() {
  //   // Better navigation menu.
  //   getOption('betterNav', betterNav.toggle.bind(betterNav));
  //   getOption('betterNavDebug', navDebug.toggle.bind(navDebug));

  //   // Disable javascript alerts.
  //   getOption('disableNotificationConfirmation', dnc.toggle.bind(dnc));
  // }

  // // call inject immediately and when options are changed
  // inject();
  // chrome.storage.onChanged.addListener(inject);




  // inject the default stylesheet
  // extension.injectStyle({ id: 'inject', src: chrome.extension.getURL('src/resources/inject.css') });
  // extension.injectScript({ id: 'inject', src: chrome.extension.getURL('src/resources/inject.js') });

})();

