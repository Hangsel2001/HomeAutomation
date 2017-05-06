"use strict";
const EventEmitter = require('events').EventEmitter;
const Chars = {
    Play: [0,8,12,14,12,8,0],
    Pause: [0,27,27,27,27,27,0],
    "Å": [4,0,14,17,31,17,17],
    "Ä": [10,0,14,17,31,17,17],
    "å": [4,0,14,1,15,17,15],
    "Ö": [10,14,17,17,17,17,14]
}
class RGBPiPlate extends EventEmitter {
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
        console.log(col);
    };
};  
module.exports = RGBPiPlate;