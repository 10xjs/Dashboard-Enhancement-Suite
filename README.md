# Dashboard Enhancement Suite
Adds features and improvements to the caorda dashboard

## Installation
Install from the chrome web store:  [Dashboard Enhancement Suite](https://chrome.google.com/webstore/detail/dashboard-enhancement-sui/bbheiamdpmdbmimancpaicialgpcpjlj)  


### Options Page
To visit the options page, click the [![options](http://i.imgur.com/wTt0Ujd.png)](chrome-extension://anfeheemhnddmckpgkcdaokkdbhkdddb/options/index.html) icon in the path bar from while on any dashboard page.

#### Available Options
 - __Improved navigation.__  
 Disables menu animation and enables predictive [menu aim](http://bjk5.com/post/44698559168/breaking-down-amazons-mega-dropdown).
 - __Instant notification delete.__  
 Individual notifications can be deleted immediately without a dialog appearing.
 - __Highlight Rows.__  
 Highlight the current row under the mouse.
 - __Task menu position.__  
 Reposition the task popup menu to prevent it from being clipped by the browser window.

## Contributing
Build the local development version with `npm run dev` and load the unpacked extension from `dev/extension` 
  
Configure new options in `src/extension/options/config.js`.  
Add option handlers to the `handleOptions` function in `src/extension/resources/inject.js`
