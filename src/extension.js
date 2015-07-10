var des = require('./des');

var extension = new des();


extension.plug(require('./plugins/betterNav.js'));
extension.plug(require('./plugins/disableNotificationConfirmation.js'));
extension.plug(require('./plugins/highlightTableRows.js'));
extension.plug(require('./plugins/taskMenuPosition.js'));
extension.plug(require('./plugins/resizeDescription.js'));
extension.plug(require('./plugins/fullScreenDescription.js'));

module.exports = extension;