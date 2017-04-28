var events = require('events');
var defaults = require('defaults');
var db = require('./measurementsdb');

var measurementTypesInfo = { "temperature":
    {
    decimals : 1,
    unit : "\xB0C"
},
    "atmospheric pressure": {
        decimals: 0,
        unit: "hPa"
    }
};

function LocationPage(config) {    
    config = defaults(config, {location: "", types:["temperature"]})
    var display = "";
    var that = this;
    var padZeros = function(value) {
        return padString("00", value);
    }
    var padString = function(filler, value) {
        return (filler + value).slice(-filler.length);
    }
    var justify8 = function(value) {
        return padString("        ", value);
    }

    this.getTime = function() {
        let time = new Date(Date.now());
        return padZeros(time.getHours()) + ":" + padZeros(time.getMinutes()) + ":"   + padZeros(time.getSeconds());
    }

    function getMeasurement(index) {
        if (config.types[index]) {
            let type = config.types[index];
            let info = measurementTypesInfo[type];
            let val = db.getLatest(config.location, type) || "----";
            let display = justify8(val + info.unit);
            return display;
        } else {
            return justify8("");
        }
    }

    this.getDisplay = function () {
        let firstM = getMeasurement(0);
        let secondM = getMeasurement(1);        
        
        return that.getTime() +firstM + "\n" + justify8(config.location) + secondM;
    }     
    setInterval(()=> {
        let newDisplay=  that.getDisplay();
  
        if (newDisplay !== display) {
            display = newDisplay;
            that.emit("update", display);
        }
    },500)
};
LocationPage.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = LocationPage; 