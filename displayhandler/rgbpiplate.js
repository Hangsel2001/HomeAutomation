"use strict";
const EventEmitter = require('events').EventEmitter;
const PiPlate = require('adafruit-i2c-lcd').plate;

const Chars = {
    Play: [0,8,12,14,12,8,0],
    Pause: [0,27,27,27,27,27,0],
    "Å": [4,0,14,17,31,17,17],
    "Ä": [10,0,14,17,31,17,17],
    "å": [4,0,14,1,15,17,15],
    "Ö": [10,14,17,17,17,17,14]
}

const Replaces = {
   "\xB0": "\xDF"
}
class RGBPiPlate extends EventEmitter {

    constructor() {
        super();
        this.lcd = new PiPlate(0, 0x20);
    }
    clear() {
        this.lcd.clear();
    };
    message(text) {
        this.lcd.message(text, true);
    };
    backlight(col) {
        this.lcd.backlight(col);
    };
};  
module.exports = RGBPiPlate;