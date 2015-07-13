 // When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'apps.caorda.com/dashboard' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

chrome.pageAction.onClicked.addListener(function(tab) {
  console.log(arguments);
  // chrome.runtime.openOptionsPage();
});


chrome.webRequest.onHeadersReceived.addListener(function(request){

  if (request.url.match(/\?view$/)) {
    for( var i = 0, len = request.responseHeaders.length; i < len; i++) {
      console.log(request.responseHeaders[i].name.toLowerCase());
      if (request.responseHeaders[i].name.toLowerCase() == 'content-disposition') {
        request.responseHeaders.splice(i, 1);
        break;
      }
    } 
  }

  return { responseHeaders: request.responseHeaders };

},{urls: ['*://apps.caorda.com/dashboard/files/*']}, ["blocking", "responseHeaders"]);