"use strict";
const EventEmitter = require('events').EventEmitter;

class RailwayPage extends EventEmitter {
    constructor(config) {
        super();
        this.socket = config.socket;
    }
    getDisplay() {
        return '\x06\x06\x06\x06\x07\x06\x06\x01\x02\x06\x06\x04\x06\x06\x05\n\x06\x06\x06\x06\x08       \x03  \x03';
    };
    getConfig() {
        return {
            chars: [
                [0, 0, 14, 4, 31, 31, 31, 10], //lok nos
                [14, 21, 21, 21, 31, 31, 31, 4], // lok bak
                [16, 16, 16, 16, 16, 16, 16, 16], // |
                [0, 0, 0, 0, 31, 4, 2, 1], // -\-
                [0, 0, 0, 0, 24, 4, 2, 1], // -\
                [0, 0, 0, 0, 31, 0, 0, 0], // -
                [0, 0, 0, 0, 31, 1, 2, 4], // -/-
                [4, 8, 16, 16, 0, 0, 0, 0] // -
            ]
        };
    }
};

module.exports = RailwayPage;