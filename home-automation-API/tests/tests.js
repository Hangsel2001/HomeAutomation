var assert = require('assert');
var mockery = require('mockery');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var Promise = require('bluebird');
var mysqlmock = require('./MySQL-Mock.js');
chai.use(chaiAsPromised);
chai.should();

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
        return dbcontext.getMeasurements('Verkstad').should.eventually.have.deep.property("temperature", 23);
    });
    
    it('gets current humidity from Verkstad', function () {
        return dbcontext.getSingleMeasurement('Verkstad', 'humidity').should.eventually.have.deep.property("humidity", 64.3);
    });

    it('gets historical values for Verkstad', function () {
        return dbcontext.getMeasurements('Verkstad', '2015-08-06 03:00', '2015-08-06 03:02').should.eventually.have.deep.property("values.length", 4);
    });

    it('gets historical temperature for Verkstad', function () { 
        return dbcontext.getSingleMeasurement('Verkstad', 'temperature', '2015-08-06 03:00', '2015-08-06 03:02').should.eventually.have.deep.property("values.length", 4);
    });

    it('gets historical temperatures for Verkstad per hour with text', function () { 
        return dbcontext.getSingleMeasurement('Verkstad', 'temperature', '2015-08-08 00:00', '2015-08-09 00:00', "hourly")
                    .should.eventually.have.deep.property("values.length", 24)
                    .and.should.eventually.have.deep.property('values[23].max', 20.7);
    });

    it('gets historical temperatures for Verkstad per hour with number', function () {
        return dbcontext.getSingleMeasurement('Verkstad', 'temperature', '2015-08-08 00:00', '2015-08-09 00:00', 60)
                    .should.eventually.have.deep.property("values.length", 24)
                    .and.should.eventually.have.deep.property('values[23].max', 20.7);
    });

})
