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
            } else if (key.name == "up") {
                this.emit("up");
            } else if (key.name == "down") {
                this.emit("down");
            } else if (key.name == "s") {
                this.emit("select");
            }
        });

        process.stdin.setRawMode(true);
        process.stdin.resume();
    }
    clear() {
        console.log("clear");
    };
    message(text) {
        text = text
        .replace(/\x01/g, "Ö")
        .replace(/\x02/g, "H")
        .replace(/\x03/g, "|")
        .replace(/\x04/g, "\\")
        .replace(/\x05/g, "\\")
        .replace(/\x06/g, "-")
        .replace(/\x07/g, "/")
        .replace(/\x08/g, "/")
        console.log(text);
    };
    backlight(col) {
        console.log("color: " + col);
    };
    setup() {}
};
module.exports = ConsolePlate;