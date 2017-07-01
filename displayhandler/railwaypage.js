"use strict";
const EventEmitter = require('events').EventEmitter;
const SocketIO = require("socket.io-client");

class RailwayPage extends EventEmitter {
    constructor(config) {
        super();
        this.socket = config.socket;
        this.state = {};
        this.socket.on("block", (data) => {
            this.state[data.name] = data;

            if (this.getDisplay() !== this.currentDisp) {
                this.currentDisp = this.getDisplay();
                this.emit("update", this.currentDisp);
            }

        });
        this.tracks = '\x06\x06\x06\x06\x07\x06\x06\x06\x06\x06\x06\x04\x06\x06\x05\n\x06\x06\x06\x06\x08       \x03  \x03';
        this.positions = [{
            name: "OuterLeft",
            x: 1,
            y: 0
        }, {
            name: "InnerLeft",
            x: 1,
            y: 1
        }, {
            name: "Middle",
            x: 7,
            y: 0
        }, {
            name: "InnerRight",
            x: 11,
            y: 1
        }, {
            name: "OuterRight",
            x: 14,
            y: 1
        }];

        this.locoLeft = "\x01\x02";

    }
    getDisplay() {
        let val = this.tracks;
        let active = undefined;
        for (let i = 0; i < this.positions.length; i++) {
            
            let current = this.positions[i];
            let currentState = this.state[current.name];
            if (currentState && currentState.loco) {
                if (currentState.status === "in" || currentState.status === "enter") {
                    active = current;
                } else if(currentState.status === "exiting" && !active) {
                    active = current;
                }
            }
        }
        if (active) {
            val = RailwayPage.insertAtIndex(this.tracks, this.locoLeft, active.x, active.y);
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
    static insertAtIndex(orig, inserted, pos, row) {
        let lines = orig.split("\n");
        let val = "";
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (i === row) {
                val = val + line.substring(0, pos) + inserted + line.substring(pos + inserted.length) + "\n";
            } else {
                val = val + line + "\n"
            }
        }

        return val.substring(0, val.length - 1);
    }
    static getPage() {
        let socket = new SocketIO("http://192.168.1.14:8080");
        return new RailwayPage({
            socket: socket
        });
    }
};

module.exports = RailwayPage;