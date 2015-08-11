var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var dbcontext = require('./dbcontext.js')




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var version = "0.0.1";

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Example app listening at http://%s:%s', host, port);
});

var router = express.Router();

router.use(function (req, res, next) {
    console.log(req);
    next();
})

router.get('/', function (req, res) { 
    res.json({ version : version})
});

router.route('/locations').get(function (req, res) {
    dbcontext.getDevices().then(function (data) {
        res.json(data);
    })
});

var countProperties = function (obj) {
    var count = 0;
    for (var i in obj) {
        if (Object.hasOwnProperty.call(obj, i)) { 
            count++;
        }
    }
    return count;
};

router.route('/locations/:location_id').get(function (req, res) {
    dbcontext.getLocationById(req.params.location_id).then(function (data){
        if (countProperties(data) > 1) { 
            res.json(data);
        } else { 
            res.status(404).json({ message: "Location does not have any values"});
        }
    });
});

//router.route('/locations/:location_id/:measurement_type').get(function (req, res) {
//    var type = req.params.measurement_type.replace("_", " ");
//    var query = "SELECT value FROM current_measurements WHERE devicename='" + req.params.location_id + "' AND type ='" + type + "'";
//    connection.query(query, function (err, rows, fields) { 
//        if (rows.length > 0) {
//            res.json(rows[0]);
//        } else {
//            res.status(404).json({ error: "Measurement type missing" });
//        }
//    });
//})

app.use('/api', router);