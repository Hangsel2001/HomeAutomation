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
          setInterval(() => {this.getHue()}, 2000);
          setInterval(() => {this.getReachable()}, 2000);
          this.scene = config.scenes[0];
          this.getHue();
          this.display = "INIT HUE PAGE\nLOADING...";
    }

    async getReachable() {
        let lights = await this.client.lights.getAll();
        const g = await this.client.groups.getById(this.config.group)   ;
        const lightsInGroup = lights.filter(v =>  g.lightIds.find(id => id === v.id ) !== undefined );
        this.unreachables = lightsInGroup.find(l => l.reachable === false) !== undefined;
    }

    async getHue() {
        
        try {
        const g = await this.client.groups.getById(this.config.group)   
        const newDisp =  this.config.header + ": " + this.scene.name + "\n" + 
        (this.unreachables ? "-" : " ") + 
        (g.on ? "O" : "X") + " B:" + g.brightness + " C:" + g.colorTemp;
        if (newDisp !== this.display) {
            this.display = newDisp;                
            this.emit("update", this.getDisplay());
        }                    
    } catch (ex) {
        console.log(ex);
    }
    }

    getDisplay() {
        return this.display;
    }

    getConfig() {}

    static getPage() {      
        return new HuePage({
            host: "192.168.1.237",
            username: 'sEzJsrSODeyWHRnlFinJ9Pzb28bR3j7rVeo30H-s',
            header: "Kontor",
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