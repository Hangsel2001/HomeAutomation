"use strict";
const EventEmitter = require('events').EventEmitter;

class RailwayPage extends EventEmitter {
    constructor(config) {
        super();
        this.socket=config.socket;
        this.state={};
        this.socket.on("block",(data)=>{
        	this.state[data.name]=data;
        });
        this.tracks ='\x06\x06\x06\x06\x07\x06\x06\x06\x06\x06\x06\x04\x06\x06\x05\n\x06\x06\x06\x06\x08       \x03  \x03';
    }
    getDisplay() {
        let val = this.tracks;
        let ol =this.state.OuterLeft;
        if (ol) {
        
         if (ol.loco && ol.status === "in") {
         	val = val.substring(0,1)+"\x01\x02"+val.substring(3);
         	}
        }
        return val;
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