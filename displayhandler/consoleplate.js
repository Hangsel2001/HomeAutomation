"use strict";
const EventEmitter = require('events').EventEmitter;
var keypress = require('keypress');

class ConsolePlate extends EventEmitter {

    constructor() {
        super();


        // make `process.stdin` begin emitting "keypress" events 
        keypress(process.stdin);

        // listen for the "keypress" event 
        process.stdin.on('keypress', (ch, key) => {
            console.log('got "keypress"', key);
            if (key && key.ctrl && key.name == 'c') {
                process.exit();
            }
            if (key.name == "left") {
                this.emit("left");
            } else if (key.name == "right") {
                this.emit("right");
            }
        });

        process.stdin.setRawMode(true);
        process.stdin.resume();
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
    setup() {}
};
module.exports = ConsolePlate;