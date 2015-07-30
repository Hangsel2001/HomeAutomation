var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var serialport = new SerialPort("COM10", {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});

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

xbeeAPI.on("frame_object", function (frame) {
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
        console.log(measurements);
    }
});

console.log("Väntar...");

