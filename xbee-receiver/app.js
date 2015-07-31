var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Vulcan2001!',
    database : 'mmeasurements'
});



var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var serialport = new SerialPort("COM10", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});

var devices = [];

var sendCurrentTime = function (address) {
    var seconds = Math.floor(Date.now() / 1000);
    seconds += 60 * 60 * 2;
    var bytes = [2, seconds >> 24, seconds >> 16 & 0xff, seconds >> 8 & 0xff, seconds & 0xff];
    serialport.write(xbeeAPI.buildFrame({
        type: 0x10, // xbee_api.constants.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST 
        id: 0x01, // optional, nextFrameId() is called per default 
        destination64: address,
        options: 0x00, // optional, 0x00 is default 
        data: bytes // Can either be string or byte array. 
    }));
    console.log(seconds);
};

var lastLog;

var logToDb = function (measurements) {
    var write = function (type, value) {
        var now = Date(Date.now());
        connection.query("REPLACE INTO current_measurements (time, devicename, type, value) VALUES (" + dateFormat(now, '%Y-%m-%d %H:%M:%S')  +", " + "Verkstad" + ", " + type+ ", " + value + ")",  function (err, rows, fields) {
        });
        if (Date.now() - lastLog > 30000) {
            connection.query("INSERT INTO measurements (time, devicename, type, value) VALUES (" + dateFormat(now, '%Y-%m-%d %H:%M:%S') + ", " + "Verkstad" + ", " + type + ", " + value + ")", function (err, rows, fields) {  
                
            });
            lastLog = Date.now();
        };
    }
    if (measurements.T) { 
        write("temperature", measurements.T);
    };
    if (measurements.H) { 
        write("humidity", measurements.H);
    }
    
};

xbeeAPI.on("frame_object", function (frame) {

    if (devices.indexOf(frame.remote64) === -1) {
        sendCurrentTime(frame.remote64);
        devices.push(frame.remote64);
    }

    if (frame.data && frame.data.length) {
        var index = 0;
        var measurements = {};
        while (index < frame.data.length) {
            var measurementsType = String.fromCharCode(frame.data[index]);
            var value;
            switch (measurementsType) {
                case "T":
                    var mostSignificant = frame.data[++index];
                    var leastSignificant = frame.data[++index];
                    var isNegative = false;
                    index++;

                    value = (mostSignificant << 8 | leastSignificant);
                    if (mostSignificant & 0x80) { 
                        value = value - 0x10000;
                    }
                    value = value / 100;

                    measurements[measurementsType] = value;
                    break;
                case "H":
                    var mostSignificant = frame.data[++index];
                    var leastSignificant = frame.data[++index];
                    index++;
                    value = (mostSignificant << 8 | leastSignificant) / 100;
                    measurements[measurementsType] = value;
                    break;

                default:
                    index++;
                    break;
                case "U":
                    sendCurrentTime(frame.remote64);
                    index++;
            }
        }
        logToDb(measurements);
    }
});

console.log("Väntar...");

