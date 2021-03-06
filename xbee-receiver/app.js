﻿var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var radioOperator
//var connection = mysql.createConnection({
//    host     : '192.168.1.28',
//    user     : 'root',
//    password : 'Vulcan2001!',
//    database : 'measurements'
//});

//connection.connect();

var C = xbee_api.constants;

var serialBusy = false;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

//var address = "/dev/ttyUSB0";
var address = "COM7";

var serialport = new SerialPort(address, {
    baudrate: 9600,
    parser: xbeeAPI.rawParser()
});

var devices = [];
var deviceNames = [];
deviceNames["0013a20040d87029"] = {name:"Car Port", address:"0013a20040d87029"};

var sendCurrentTime = function (address, done) {
    var bytes = dateToBytes(Date.now());
    serialport.write(xbeeAPI.buildFrame({
        type: 0x10, // xbee_api.constants.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST 
        id: 0x01, // optional, nextFrameId() is called per default 
        destination64: address,
        options: 0x00, // optional, 0x00 is default 
        data: bytes // Can either be string or byte array. 
    }), done);
};

var sendDeviceName = function (address, done) {
    if (deviceNames[address]) {
        
        serialport.write(xbeeAPI.buildFrame({
            type: 0x10, // xbee_api.constants.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST 
            id: 0x01, // optional, nextFrameId() is called per default 
            destination64: address,
            options: 0x00, // optional, 0x00 is default 
            data: String.fromCharCode(1) + deviceNames[address].name + String.fromCharCode(4) // Can either be string or byte array. 
        }), done);
    };
};

var sendMessage = function (address, done) {
       
        serialport.write(xbeeAPI.buildFrame({
            type: 0x10, // xbee_api.constants.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST 
            id: 0x01, // optional, nextFrameId() is called per default 
            destination64: address,
            options: 0x00, // optional, 0x00 is default 
            data: String.fromCharCode(5) + "Detta är ett med\ndelande från M" + String.fromCharCode(4) // Can either be string or byte array. 
        }), done);
};

var dateToBytes = function (date) { 
    var seconds = Math.floor(date / 1000);
    seconds += 60 * 60 * 2;
    return  [2, seconds >> 24, seconds >> 16 & 0xff, seconds >> 8 & 0xff, seconds & 0xff];
}

var lastLog = {};

var logToDb = function (measurements) {
    var write = function (type, value) {
        if (lastLog[type] == undefined) {
            lastLog[type] = 0;
        }
		var deviceName = devices[measurements.address].name;
        var now = Date(Date.now());
        var query = "REPLACE INTO current_measurements (time, devicename, type, value) VALUES ('" + dateFormat(now, 'yyyy-mm-dd HH:MM:ss')  +"', '" + deviceName + "', '" + type+ "', " + value + ")";
        console.log(query);
        connection.query(query,  function (err, rows, fields) {
            console.log(err);
        });
        if (Date.now() - lastLog[type] > 30000) {
            connection.query("INSERT INTO measurements (time, devicename, type, value) VALUES ('" + dateFormat(now,  'yyyy-mm-dd HH:MM:ss') + "', '" + deviceName + "', '" +type + "', " + value + ")", function (err, rows, fields) {  
            console.log(query);     
            });
            lastLog[type] = Date.now();
        };
    }
    if (measurements.T) { 
        write("temperature", measurements.T);
    };
    if (measurements.H) { 
        write("humidity", measurements.H);
    }
    
};

var initDevice = function (address) {
    console.log("Update current time for " + address)
    sendCurrentTime(address, function () {
        console.log("Send device name for " + address);
        sendDeviceName(address, function () {
            sendMessage(address);
});     
    });
    devices.push(address);
}

xbeeAPI.on("frame_object", function (frame) {
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

    if (devices.indexOf(frame.remote64) === -1) {
        initDevice(frame.remote64);
    }

    if (frame.data && frame.data.length) {
        console.log("Received data: " + frame.data);
        var index = 0;
		var measurements = { address: frame.remote64};
        while (index < frame.data.length) {
            var measurementsType = String.fromCharCode(frame.data[index]);
            var value;
            switch (measurementsType) {
                case "T":
                    measurements[measurementsType] = readTempFromFrame(frame.data);
                    break;
                case "H":
                    var mostSignificant = frame.data[++index];
                    var leastSignificant = frame.data[++index];
                    index++;
                    value = (mostSignificant << 8 | leastSignificant) / 100;
                    measurements[measurementsType] = value;
                    break;
                case "U":
                    sendCurrentTime(frame.remote64);
                    index++;
                    break;
                case "N":
                    sendDeviceName(frame.remote64);
                    index++;
                    break;
                default:
                    index++;
                    break;
                

            }
        }
  //      logToDb(measurements);
        console.log(measurements);
    }
});


console.log("Väntar...");


