let LocationPage = require("../locationpage");
let db = require("../measurementsdb");
var Promise = require('promise');

describe("LocationPage with 16x2 LCD", () => {
    let time, page;
    let measurements = {};
    let getLatest;
    beforeEach(() => {
        time = new Date(2017, 04, 26, 13, 00, 10);
        jasmine.clock().install();
        jasmine.clock().mockDate(time);
        spyOn(db.prototype, "connect").and.returnValue(Promise.resolve());
        page = new LocationPage({
            location: "Kontoret"
        });

    })
    beforeEach(() => {
        getLatest = spyOn(db.prototype, "getLatest").and.callFake((location, type) => {
            return new Promise.resolve(measurements[location + " " + type]);
        })
    })
    afterEach(() => {
        // tk.reset();
        //   console.log("after")
        jasmine.clock().uninstall();
    })
    it("updates clock", () => {
        let page = new LocationPage();

        let content = page.getDisplay();
        let clock = content.substring(0, 8);
        expect(clock).toBe("13:00:10");

        jasmine.clock().tick(1001);
        let nextclock = page.getDisplay().substring(0, 8);
        expect(nextclock).toBe("13:00:11")

    });


    it("emits when new time", () => {
        let page = new LocationPage();
        let first = false;
        let emit = spyOn(page, "emit");
        jasmine.clock().tick(1001);
        expect(emit.calls.mostRecent().args[1].substring(0, 8)).toBe("13:00:11");
    });

    it("shows location name on second line", () => {

        let lines = page.getDisplay().split("\n");
        expect(lines[1].indexOf("Kontoret")).toBe(0);
    })

    describe("measurements", () => {
        beforeEach(() => {
            measurements = {
                "Kontoret temperature": 24.3,
                "Kontoret atmospheric pressure": 1023
            }
        })


        it("fetches measurements from db", (done) => {
            page.on("update", (content) => {
                let lines = content.split("\n");
                expect(getLatest).toHaveBeenCalledWith("Kontoret", "temperature");
                expect(lines[0]).toBe("13:00:10  24.3\xB0C")
                done();
            });
        });

        it("can be configured for correct measurement types", (done) => {
            page = new LocationPage({
                location: "Kontoret",
                types: ["atmospheric pressure"]
            });
            page.on("update", (content) => {
                let lines = content.split("\n");
                expect(lines[0]).toBe("13:00:10 1023hPa");
                done();
            })

        });

        it("can show two measurements", (done) => {
            page = new LocationPage({
                location: "Kontoret",
                types: ["temperature", "atmospheric pressure"]
            });
            page.on("update", (content) => {

                expect(content).toBe("13:00:10  24.3\xB0C\nKontoret 1023hPa");
                done();
            });
        })

        it("shows dashes when no values", (done) => {
            page = new LocationPage({
                location: "EmptyLoc",
                types: ["temperature", "atmospheric pressure"]
            });
            page.on("update", (content) => {
                expect(content).toBe("13:00:10  ----\xB0C\nEmptyLoc ----hPa");
                done()
            });
        })
    });
});