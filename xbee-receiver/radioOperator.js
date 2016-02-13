var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var events = require('events');

var C = xbee_api.constants;

var serialBusy = false;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});


const RO = {
    SEND_NAME : 1,
    SEND_TIME : 2,
    SEND_MESSAGE : 5
}


var dateToBytes = function (date) {
    var seconds = Math.floor(date / 1000);
    seconds += 60 * 60 * 2;
    return [2, seconds >> 24, seconds >> 16 & 0xff, seconds >> 8 & 0xff, seconds & 0xff];
}



function Operator(port) {
    events.EventEmitter.call(this);
    
    var devices = [];
    var deviceNames = [];
    var that = this;

    
    var send = function (address, data, done) { 
        serialport.write(xbeeAPI.buildFrame({
            type: 0x10, // xbee_api.constants.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST 
            id: 0x01, // optional, nextFrameId() is called per default 
            destination64: address,
            options: 0x00, // optional, 0x00 is default 
            data: data // Can either be string or byte array. 
        }), done);
    };

    var serialport = new SerialPort(port, {
        baudrate: 9600,
        parser: xbeeAPI.rawParser()
    });

    this.sendCurrentTime = function (address, done) {
        send(address, dateToBytes(Date.now()), done);
    };
    
    this.sendDeviceName = function (address, name, done) {
            var data = String.fromCharCode(1) + name
            send (address, data, done);
    };
    
    this.sendMessage = function (address, message, done) {      
        send(address, message, done);
    };
    
    var readFrame = function (frame) {
        var readTempFromFrame = function (data) {
            var mostSignificant = data[++index];
            var leastSignificant = data[++index];
            var isNegative = false;
            index++;
            
            value = (mostSignificant << 8 | leastSignificant);
            if (mostSignificant & 0x80) {
                value = value - 0x10000;
            }
            value = value / 100;
            return value;
        }

        
        if (frame.data && frame.data.length) {
            console.log("Received data: " + frame.data);
            var index = 0;
            var measurements = { address: frame.remote64 };
            while (index < frame.data.length) {
                var measurementsType = String.fromCharCode(frame.data[index]);
                var value;
                switch (measurementsType) {
                    case "T":
                        measurements[measurementsType] = readTempFromFrame(frame.data);
                        that.emit('measurement', measurements);
                        break;
                    case "H":
                        var mostSignificant = frame.data[++index];
                        var leastSignificant = frame.data[++index];
                        index++;
                        value = (mostSignificant << 8 | leastSignificant) / 100;
                        measurements[measurementsType] = value;
                        that.emit('measurement', measurements);
                        break;
                    case "U":
                        that.emit("timerequest", frame.remote64);
                        index++;
                        break;
                    case "N":
                        that.emit("namerequest", frame.remote64);
                        index++;
                        break;
                    default:
                        index++;
                        break;
                

                }
            }
        }
    };

    xbeeAPI.on("frame_object", readFrame);
}

Operator.prototype.__proto__ = events.EventEmitter.prototype;

exports.Operator = Operator;
