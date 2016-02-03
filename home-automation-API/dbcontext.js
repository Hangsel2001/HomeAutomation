var mysql = require('mysql');
var Promise = require('bluebird');
var settings = require('./settings.js');
var moment = require('moment');

var connection = mysql.createConnection( {
    host     : settings.db.host,
    user     : settings.db.user,
    password : settings.db.pw,
    database : settings.db.database
});

connection.connect();


var getDevices = function () {
    var query = "SELECT shortname FROM devices";
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, rows, fields) {
            resolve(rows);
        });
    });
};

var getCurrentValues = function (locationId) {
    var query = "SELECT type, value FROM current_measurements WHERE devicename = ?";
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, rows, fields) {
            rows.push({ "type" : "location" , "value" : locationId });
            resolve(flatten(rows));
        });
    });
}

var flatten = function (rows) {
    var obj = {};
    for (var i = 0; i < rows.length; i++) {
        obj[rows[i].type] = rows[i].value;
    }
    return obj;
};

var getHistoricalValues = function (locationId, start, end) { 
    var query = "SELECT type, value, time FROM measurements WHERE devicename = ? AND time BETWEEN ? AND ? ORDER BY time";
    return new Promise(function (resolve, reject) {
        connection.query(query, [locationId, start, end], function (err, rows, fields) {
            var lastTime = moment('2000-01-01'),
            itemTime, current, diff, value;
            var returnObject = { location: locationId , values : [] };
            for (var i = 0; i < rows.length; i++) {
                current = rows[i];
                itemTime = moment(current.time);

                if (itemTime.diff(lastTime) > settings.measurementSpan) { // behåller förra objektet om inom intervallet
                    value = { time: itemTime };
                    returnObject.values.push(value);
                }
                lastTime = itemTime;
                value[current.type] = current.value;
            }
            resolve(returnObject);
        });
    });
};

var getGroupPart = function (res) {
    var groupQuery = "GROUP BY %1(time)";
};

var getHistoricalMeasurements = function (locationId, type, start, end, resolution) {

    var query = "SELECT type, value, time FROM measurements WHERE devicename = ? AND type = ? AND time BETWEEN ? AND ? ORDER BY time";
    return new Promise(function (resolve, reject) {
        connection.query(query, [locationId, type, start, end], function (err, rows, fields) {
            resolve({ location: locationId , values : rows });
        });
    });
};

var getMeasurements = function (locationId, start, end) {
    if (start === undefined && end === undefined) {
        return getCurrentValues(locationId);
    } else { 
        return getHistoricalValues(locationId, start, end);
    }  
};



var getCurrentMeasurement = function (locationId, measurementType) {
    var query = "SELECT type, value FROM current_measurements WHERE devicename = ? AND type = ? ORDER BY date DESC LIMIT 1";
    return new Promise(function (resolve, reject) {
        connection.query(query, [locationId, measurementType], function (err, rows, fields) {
            rows.push({ "type" : "location" , "value" : locationId });
            resolve(flatten(rows));
        });
    });
};

var getSingleMeasurement = function (locationId, measurementType, start, end) { 
    if (start === undefined && end === undefined) {
        return getCurrentMeasurement(locationId, measurementType);
    } else {
        return getHistoricalMeasurements(locationId, measurementType, start, end);
    }    
};

exports.getDevices = getDevices;
exports.getMeasurements = getMeasurements;
exports.getSingleMeasurement = getSingleMeasurement;
