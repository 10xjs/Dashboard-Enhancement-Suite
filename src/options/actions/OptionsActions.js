var update = require('react/addons').addons.update;

module.exports = {
  getOptions: function(context, payload, done) {
    context.dispatch('GET_OPTIONS_START');
    chrome.storage.sync.get(null, function(results){
      if (chrome.runtime.lastError) {
        context.dispatch('GET_OPTIONS_FAILURE', chrome.runtime.lastError);
      } else {
        context.dispatch('GET_OPTIONS_SUCCESS', results);
      }
      done();
    });
  },
  setOption: function(context, payload, done) {
    context.dispatch('SET_OPTION_START', payload);
    chrome.storage.sync.set(payload, function(){
      if (chrome.runtime.lastError) {
        context.dispatch('SET_OPTION_FAILURE', chrome.runtime.lastError);
      } else {
        context.dispatch('SET_OPTION_SUCCESS');
      }
      done();
    });
  }
};