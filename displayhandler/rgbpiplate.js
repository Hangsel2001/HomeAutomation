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
        this.lcd.on("button_down", (button)=> {
            button = this.lcd.buttonName(button);
            console.log(button);
            if (button === "LEFT") {
                this.emit("left");
            } else if (button === "RIGHT") {
                this.emit("right");
            } else if (button === "UP") {
                this.emit("up");
            } else if (button === "DOWN") {
                this.emit("down");
            } else if (button === "SELECT") {
                this.emit("select");
            }
        })
    }
    clear() {
        this.lcd.clear();
    };
    message(text) {
        text=  text.replace("\xB0","\xDF");
        this.lcd.message(text, true);
    };
    backlight(col) {
        this.lcd.backlight(col);
    };
    setup(data) {    
        if (data && data.chars) {
            let chars = data.chars;
            for(let i=0;i<8;i++) {
                this.lcd.createChar(i+1, chars[i]);
            }
        }
    }
};  
module.exports = RGBPiPlate;