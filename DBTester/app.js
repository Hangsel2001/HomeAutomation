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
var query = "SELECT type, value FROM current_measurements WHERE devicename='Verkstad'";

connection.query(query, function (err, rows, fields) {
  
});