const GET_FROM_CURRENT = "SELECT value FROM current_measurements WHERE type = ? AND devicename = ? LIMIT 1"
const mysql = require('mysql');
var Promise = require('promise');

function MeasurementsDb() {
    this.connection = mysql.createConnection({
        host: '192.168.1.40',
        user: 'reader',
        password: 'reader_pass',
        database: 'measurements'
    });

}

    MeasurementsDb.prototype.connect = function () {
        return new Promise((resolve, reject) => {
            this.connection.connect((err, arg) => {
                if (err) {
                    reject(err);
                }
                resolve(arg);
            });
        });
    }
    MeasurementsDb.prototype.getLatest = function (device, type) {
        return new Promise((resolve, reject) => {
            this.connection.query(GET_FROM_CURRENT, [type, device], (error, results, fields) => {
                if (error) {
                    reject(error)
                };
                if (results.length > 0) {
                    resolve(results[0].value);
                } else {
                    resolve(null);
                }
            })
        });

    }

module.exports = MeasurementsDb;