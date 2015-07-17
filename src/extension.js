var des = require('./des');

var extension = new des();


extension.plug(require('./plugins/betterNav/betterNav.js'));
extension.plug(require('./plugins/disableNotificationConfirmation/disableNotificationConfirmation.js'));
extension.plug(require('./plugins/highlightTableRows/highlightTableRows.js'));
extension.plug(require('./plugins/taskMenuPosition/taskMenuPosition.js'));
extension.plug(require('./plugins/resizeDescription/resizeDescription.js'));
extension.plug(require('./plugins/fullScreenDescription/fullScreenDescription.js'));
extension.plug(require('./plugins/taskFiles/taskFiles.js'));
extension.plug(require('./plugins/taskHistory/taskHistory.js'));
extension.plug(require('./plugins/taskMeta/taskMeta.js'));

module.exports = extension;