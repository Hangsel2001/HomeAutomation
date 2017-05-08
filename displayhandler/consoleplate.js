"use strict";
const EventEmitter = require('events').EventEmitter;

class ConsolePlate extends EventEmitter {

    constructor() {
        super();
    }
    clear() {
    console.log("clear");
    };
    message(text) {  
     console.log(text);
    };
    backlight(col) {
     console.log("color: " + col);
    };
};  
module.exports = ConsolePlate;