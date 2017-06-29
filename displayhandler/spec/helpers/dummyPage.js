"use strict";
const EventEmitter = require('events').EventEmitter;
class DummyPage extends EventEmitter {
    constructor(message) {
        super();
        this.message= message;
        this.counter = 0;
    }
    trigger() {
        this.counter++;
        this.emit("update", this.getDisplay());
    }
    getDisplay() {
        return (this.message || "DummyPage") + "\n" + this.counter;
    }
    getConfig() {};
}

module.exports = DummyPage;