var events = require('events');
function LocationPage() {
    this.title = "Kontor";
    this.line1 = "23:34:18";
};
LocationPage.prototype.__proto__ = events.EventEmitter.prototype;

exports.LocationPage = LocationPage;