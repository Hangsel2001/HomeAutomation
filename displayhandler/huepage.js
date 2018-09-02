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
          this.sceneIndex = 0;
          this.scene = config.scenes[this.sceneIndex];
          this.getHue();
          this.display = "INIT HUE PAGE\nLOADING...";
          this.color = 7;
          this.colorPending = true;
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
        let newColor = this.getColorFromColorTemp(g.colorTemp);
        if (newColor !== this.color) {
            this.color = newColor;
            this.colorPending = true;
        }
        if (newDisp !== this.display) {
            this.display = newDisp;                            
            this.emit("update", this.getDisplay());
        } else if (this.colorPending){
            this.emit("update", this.getDisplay());
        }
    } catch (ex) {
        console.log(ex);
    }
    }

    getColorFromColorTemp(colorTemp) {
        if (colorTemp < 200) {
            return 4
        } else if (colorTemp <250) {
            return 5;
        } else if (colorTemp <350) {
            return 7
        } else if (colorTemp < 400) {
            return 3;
        } else {
            return 1;
        }        
    }

    getDisplay() {
        if (this.colorPending !== null) {            
            this.colorPending = false;
            return {color: this.color, text: this.display};
        } else {
            return this.display;
        }        
    }

    getConfig() {
        this.colorPending = true;
    }

    async down() {
        this.sceneIndex++;
        await this.updateScene();
    }

    async updateScene() {
        this.sceneIndex = (this.config.scenes.length + this.sceneIndex) % this.config.scenes.length;
        this.scene = this.config.scenes[this.sceneIndex];
        const g = await this.client.groups.getById(this.config.group);
        g.brightness = this.scene.brightness || g.brightness;
        g.colorTemp = this.scene.colorTemp || g.colorTemp;
        g.on = this.scene.on;
        await this.save(g);

    }

    async save(g) {
        // console.log(g);
        return this.client.groups.save(g);
    }

    async up() {
        this.sceneIndex--;
        await this.updateScene();
    }

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