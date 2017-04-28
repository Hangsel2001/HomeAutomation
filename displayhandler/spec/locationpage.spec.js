let LocationPage = require("../locationpage");
let db = require("../measurementsdb");

describe("LocationPage with 16x2 LCD", () => {
    let time, page;
    beforeEach(() => {
        time = new Date(2017, 04, 26, 13, 00, 10);
        jasmine.clock().install();
        jasmine.clock().mockDate(time);
        page = new LocationPage({
            location: "Kontoret"
        });

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
        let getLatest;
        let measurements = {
            "Kontoret temperature": 24.3,
            "Kontoret atmospheric pressure": 1023
        }
        beforeEach(() => {
            getLatest = spyOn(db, "getLatest").and.callFake((location, type) => {
                return measurements[location +" " +type];
            })
        })
        it("fetches measurements from db", () => {
            let lines = page.getDisplay().split("\n");
            expect(getLatest).toHaveBeenCalledWith("Kontoret", "temperature");
            expect(lines[0]).toBe("13:00:10  24.3\xB0C")
        });

        it("can be configured for correct measurement types", () => {
            page = new LocationPage({
                location: "Kontoret",
                types: ["atmospheric pressure"]
            });
            let lines = page.getDisplay().split("\n");
            expect(lines[0]).toBe("13:00:10 1023hPa");
        });

        it ("can show two measurements", ()=>{
            page = new LocationPage({
                location: "Kontoret",
                types: ["temperature", "atmospheric pressure"]
            });
            expect(page.getDisplay()).toBe("13:00:10  24.3\xB0C\nKontoret 1023hPa");
        })
    });
});