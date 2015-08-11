var assert = require('assert');
var mockery = require('mockery');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var Promise = require('bluebird');
chai.use(chaiAsPromised);
chai.should();

var mysqlmock = {
    createConnection : function () {
        return {
            connect : function () { },
            query : function (query, method) {
                switch (query) {
                    case "SELECT shortname FROM devices":
                        method(null, [{ "shortname": "Kontor" }, { "shortname": "Verkstad" }]);
                        break;
                    case "SELECT type, value FROM current_measurements WHERE devicename='Verkstad'":
                        method(null, [{ "type": "temperature", "value": 23 }, { "type": "humidity", "value": 64.3 }]);
                        break;
                    case "SELECT type, value, time FROM measurements WHERE devicename='Verkstad' AND time BETWEEN '2015-08-06 03:00' AND '2015-08-06 03:02'":
                        var returnValue = [{ "type": "temperature", "value": 18.3, "time": "2015-08-06T01:00:00.000Z" }, { "type": "humidity", "value": 62.3, "time": "2015-08-06T01:00:00.000Z" }, { "type": "temperature", "value": 18.3, "time": "2015-08-06T01:00:31.000Z" }, { "type": "humidity", "value": 62.3, "time": "2015-08-06T01:00:31.000Z" }, { "type": "temperature", "value": 18.3, "time": "2015-08-06T01:01:01.000Z" }, { "type": "humidity", "value": 61.9, "time": "2015-08-06T01:01:01.000Z" }, { "type": "temperature", "value": 18.3, "time": "2015-08-06T01:01:31.000Z" }, { "type": "humidity", "value": 62.2, "time": "2015-08-06T01:01:31.000Z" }];
                        for (var i = 0; i < returnValue.length; i++) {
                            returnValue[i].time = Date(returnValue[i].time);
                        }
                        method(returnValue);
                };
            }
        };
    }
};

describe('DB Context', function () {
    var dbcontext;
    
    before(function () {
        mockery.enable();
        mockery.registerMock("mysql", mysqlmock);
        dbcontext = require('../dbcontext.js');
    });
    
    after(function () {
        mockery.deregisterMock("mysql");
        mockery.disable();
        dbcontext = null;
    });

    it('gets all devices', function () {
        return dbcontext.getDevices().should.eventually.have.length(2);
    });
    
    it('gets current measurements for Verkstad', function () {
        return dbcontext.getLocationById('Verkstad').should.eventually.have.deep.property("temperature", 23);
    });

    it('gets historical values for Verkstad', function() {
        return dbcontext.getLocationById('Verkstad', '2015-08-06 03:00', '2015-08-06 03:02').should.eventually.have.length(8);
    });

})
