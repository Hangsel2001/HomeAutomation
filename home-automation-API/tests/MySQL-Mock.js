module.exports = {
        createConnection : function () {
            return {
                connect : function () { },
                query : function (query, values, method) {
                    if (typeof values === 'function') {
                        method = values;
                        values = [];
                    }
                    switch (query) {
                        case "SELECT shortname FROM devices":
                            method(null, [{ "shortname": "Kontor" }, { "shortname": "Verkstad" }]);
                            break;
                        case "SELECT type, value FROM current_measurements WHERE devicename = ?":
                            method(null, [{ "type": "temperature", "value": 23 }, { "type": "humidity", "value": 64.3 }]);
                            break;
                        case "SELECT type, value, time FROM measurements WHERE devicename = ? AND time BETWEEN ? AND ? ORDER BY time":
                            var returnValue = [{ "type": "temperature", "value": 18.3, "time": new Date("2015-08-06T01:00:00.000Z") }, { "type": "humidity", "value": 62.3, "time": new Date("2015-08-06T01:00:00.000Z") }, { "type": "temperature", "value": 18.3, "time": new Date("2015-08-06T01:00:31.000Z") }, { "type": "humidity", "value": 62.3, "time": new Date("2015-08-06T01:00:31.000Z") }, { "type": "temperature", "value": 18.3, "time": new Date("2015-08-06T01:01:01.000Z") }, { "type": "humidity", "value": 61.9, "time": new Date("2015-08-06T01:01:01.000Z") }, { "type": "temperature", "value": 18.3, "time": new Date("2015-08-06T01:01:31.000Z") }, { "type": "humidity", "value": 62.2, "time": new Date("2015-08-06T01:01:31.000Z") }];
                            method(null, returnValue);
                            break;
                        case "SELECT type, value, time FROM measurements WHERE devicename = ? AND type = ? AND time BETWEEN ? AND ? ORDER BY time":
                            var returnValue = [{ "type": "temperature", "value": 18.3, "time": new Date("2015-08-06T01:00:00.000Z") }, { "type": "temperature", "value": 18.3, "time": new Date("2015-08-06T01:00:31.000Z") }, { "type": "temperature", "value": 18.3, "time": new Date("2015-08-06T01:01:01.000Z") }, { "type": "temperature", "value": 18.3, "time": new Date("2015-08-06T01:01:31.000Z") }];
                            method(null, returnValue);
                            break;
                        case "SELECT type, value FROM current_measurements WHERE devicename = ? AND type = ? ORDER BY date DESC LIMIT 1":
                            method(null, [{ "type": "humidity", "value": 64.3 }]);
                        break;
                    case "SELECT type, MIN(value) AS min, MAX(value) AS max, AVG(value) AS avg, MIN(time) AS time FROM measurements WHERE devicename= ? AND type = ? AND time BETWEEN ? AND ? GROUP BY HOUR(time) ORDER BY time":
                            method(null, [{"type":"temperature","min":19.8,"max":20.7,"avg":20.32625,"time": new Date("2015-08-07T22:00:15.000Z")},{"type":"temperature","min":20.3,"max":20.5,"avg":20.385714285714,"time": new Date("2015-08-07T23:00:25.000Z")},{"type":"temperature","min":20,"max":20.3,"avg":20.129166666667,"time": new Date("2015-08-08T00:00:03.000Z")},{"type":"temperature","min":19.6,"max":20,"avg":19.839166666667,"time": new Date("2015-08-08T01:00:10.000Z")},{"type":"temperature","min":19.3,"max":19.7,"avg":19.5175,"time": new Date("2015-08-08T02:00:21.000Z")},{"type":"temperature","min":19.1,"max":19.4,"avg":19.220168067227,"time": new Date("2015-08-08T03:00:28.000Z")},{"type":"temperature","min":18.9,"max":19.1,"avg":18.985,"time":"2015-08-08T04:00:05.000Z"},{"type":"temperature","min":18.9,"max":21.7,"avg":19.2675,"time":"2015-08-08T05:00:13.000Z"},{"type":"temperature","min":20.6,"max":27.5,"avg":23.363865546218,"time":"2015-08-08T06:00:26.000Z"},{"type":"temperature","min":20.2,"max":20.6,"avg":20.2875,"time":"2015-08-08T07:00:04.000Z"},{"type":"temperature","min":20.3,"max":20.8,"avg":20.590833333333,"time":"2015-08-08T08:00:11.000Z"},{"type":"temperature","min":20.7,"max":21,"avg":20.895,"time":"2015-08-08T09:00:19.000Z"},{"type":"temperature","min":21,"max":21.2,"avg":21.053781512605,"time":"2015-08-08T10:00:26.000Z"},{"type":"temperature","min":21.1,"max":21.3,"avg":21.253333333333,"time":"2015-08-08T11:00:03.000Z"},{"type":"temperature","min":21.3,"max":21.5,"avg":21.376470588235,"time":"2015-08-08T12:00:20.000Z"},{"type":"temperature","min":21.4,"max":21.6,"avg":21.545,"time":"2015-08-08T13:00:06.000Z"},{"type":"temperature","min":21.6,"max":21.6,"avg":21.6,"time":"2015-08-08T14:00:26.000Z"},{"type":"temperature","min":21.6,"max":21.7,"avg":21.600833333333,"time":"2015-08-08T15:00:09.000Z"},{"type":"temperature","min":21.5,"max":21.6,"avg":21.579831932773,"time":"2015-08-08T16:00:25.000Z"},{"type":"temperature","min":21.4,"max":21.5,"avg":21.491666666667,"time":"2015-08-08T17:00:11.000Z"},{"type":"temperature","min":21.3,"max":21.5,"avg":21.357983193277,"time":"2015-08-08T18:00:28.000Z"},{"type":"temperature","min":21,"max":21.3,"avg":21.121666666667,"time":"2015-08-08T19:00:14.000Z"},{"type":"temperature","min":20.6,"max":21,"avg":20.819166666667,"time":"2015-08-08T20:00:22.000Z"},{"type":"temperature","min":20.3,"max":20.7,"avg":20.479831932773,"time":"2015-08-08T21:00:29.000Z"}])
                        default:
                            throw new Error("Missing query in test");
                    };
                }
            };
        }
    };