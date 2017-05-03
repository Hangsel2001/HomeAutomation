var events = require('events');
var defaults = require('defaults');
var db = new(require('./measurementsdb'))();
const EMPTY = "----";

var measurementTypesInfo = {
    "temperature": {
        decimals: 1,
        unit: "\xB0C"
    },
    "atmospheric pressure": {
        decimals: 0,
        unit: "hPa"
    },
    "humidity": {
        decimals: 1,
        unit: "%"
    }
};

function LocationPage(config) {

    config = defaults(config, {
        location: "",
        types: ["temperature"]
    })
    var firstM = "",
        secondM = "";
    var display = "";
    var that = this;
    var padZeros = function (value) {
        return padString("00", value);
    }
    var padString = function (filler, value) {
        return (filler + value).slice(-filler.length);
    }

    var add8Spaces = function (value) {
        return (value + "        ").slice(0, 8);
    }

    var justify8 = function (value) {
        return padString("        ", value);
    }

    this.getTime = function () {
        let time = new Date(Date.now());
        return padZeros(time.getHours()) + ":" + padZeros(time.getMinutes()) + ":" + padZeros(time.getSeconds());
    }

    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    function getMeasurement(index) {
        return new Promise((resolve, reject) => {
            if (!config.types[index]) {
                resolve(justify8(""));
            };
            let type = config.types[index];
            let info = measurementTypesInfo[type];
            db.getLatest(config.location, type).then((val) => {
                if (val) {
                    val = round(val, info.decimals);
                }

                let display = justify8((val || EMPTY) + info.unit);
                resolve(display);

            })
        });
    }

    this.getDisplay = function () {


        return that.getTime() + firstM + "\n" + add8Spaces(config.location) + secondM;
    }
    this.getMeasurements = () => {
        let p0 = getMeasurement(0).then((val) => {
            firstM = val
        });
        let p1 = getMeasurement(1).then((val) => {
            secondM = val
        });
        return Promise.all([p0, p1]);
    }
    this.handleDisplay = () => {
        let newDisplay = that.getDisplay();

        if (newDisplay !== display) {
            display = newDisplay;
            that.emit("update", display);
        }
    };

    setInterval(() => {
            this.handleDisplay();
        }, 100),
        setInterval(this.getMeasurements, 5000)
    db.connect().then(() => {
        this.getMeasurements().then(() => {
                this.handleDisplay();
            }

        )
    });
};
LocationPage.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = LocationPage;