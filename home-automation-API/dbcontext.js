var mysql = require('mysql');
var Promise = require('bluebird');
var settings = require('./settings.js');

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

var getCurrentValuesFromLocationById = function (locationId) {
    var query = "SELECT type, value FROM current_measurements WHERE devicename='" + locationId + "'";
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, rows, fields) {
            var returnObject = { location: locationId };
            for (var i = 0; i < rows.length; i++) {
                returnObject[rows[i].type] = rows[i].value;
            }
            resolve(returnObject);
        });
    });
}

var getHistoricalValuesFromLocationById = function (locationId, start, end) { 
    var query = "SELECT type, value FROM current_measurements WHERE devicename='" + locationId + "'";
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, rows, fields) {
            var returnObject = { location: locationId };
            for (var i = 0; i < rows.length; i++) {
                returnObject[rows[i].type] = rows[i].value;
            }
            resolve(returnObject);
        });
    });
};

var getLocationById = function (locationId, start, end) {
    if (start === undefined && end === undefined) {
        return getCurrentValuesFromLocationById(locationId);
    } else { 
        return getHistoricalValuesFromLocationById(locationId, start, end);
    }
   
};

exports.getDevices = getDevices;
exports.getLocationById = getLocationById;