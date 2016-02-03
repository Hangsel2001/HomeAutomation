var mysql = require('mysql');

var db = {
    user : "reader",
    pw : "readerpass",
    host : "raspberrypi",
    database : "measurements"
};

var connection = mysql.createConnection({
    host     : db.host,
    user     : db.user,
    password : db.pw,
    database : db.database
});

connection.connect();
/// yyyy-mm-dd HH:MM:ss
//var query = "SELECT type, value, time FROM measurements WHERE devicename='Verkstad' AND time BETWEEN '2015-08-06 03:00' AND '2015-08-06 03:02'";
//var query = "SELECT type, value FROM current_measurements WHERE devicename='Verkstad'";
//var query = "SELECT type, value FROM current_measurements WHERE devicename = ? AND type = ? ORDER BY time DESC LIMIT 1 ";

var query = "SELECT type, MIN(value) AS min, MAX(value) AS max, AVG(value) AS avg, MIN(time) AS time FROM measurements WHERE devicename= ? AND type = ? AND time BETWEEN '2015-08-08 00:00' AND '2015-08-09 01:00' GROUP BY HOUR(time) ORDER BY time  ";

connection.query(query, ['Verkstad', 'temperature'], function (err, rows, fields) {
  
});