"use strict";
const EventEmitter = require('events').EventEmitter;
const huejay = require('huejay');

class HuePage extends EventEmitter {


    constructor(config) {
        super()
        this.config = config;
        this.client = new huejay.Client({
            host:     config.host,        
            username: config.username        
          });     
          setInterval(() => {this.getHue()}, 5000)     
          this.scene = config.scenes[0];
          this.getHue();
          this.display = config.header + "\n" + this.scene.name;
    }

    getHue() {
        
        this.client.groups.getById(this.config.group).then((g)=> {
            const newDisp =  g.brightness + " " + g.colorTemp;
            if (newDisp !== this.display);
            this.display = newDisp;
            this.emit("update", this.getDisplay());
        })
    }

    getDisplay() {
        return this.display;
    }

    getConfig() {}

    static getPage() {      
        return new HuePage({
            host: "192.168.1.237",
            username: 'sEzJsrSODeyWHRnlFinJ9Pzb28bR3j7rVeo30H-s',
            header: "Kontoret",
            group: 2,
            scenes: [                
                {name: "Dag", on:true, brightness:255, colorTemp:233},
                {name: "Kväll", on:true, brightness:144, colorTemp:447},
                {name:"Natt", on:true, brightness:1, colorTemp:447},
                {name: "Av", on:false}
            ]
        });
    }
}

module.exports = HuePage