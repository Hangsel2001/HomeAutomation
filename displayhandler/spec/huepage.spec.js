const HuePage = require("../huepage");
const groups = require('../node_modules/huejay/lib/Accessor/Groups');
describe ("huePage", () => {
    let page;
    beforeEach(()=> {
        page = new HuePage({
            host: "host",
            username: 'user',
            header: "Kontor",
            group: 2,
            scenes: [                
                {name: "Dag", on:true, brightness:255, colorTemp:233},
                {name: "Kväll", on:true, brightness:144, colorTemp:447},
                {name:"Natt", on:true, brightness:1, colorTemp:447},
                {name: "Av", on:false}
            ]
        });
    })
    it("formats display", async () => {        
        spyOn(groups.prototype, "getById").and.returnValue(Promise.resolve({on:true, brightness:155, colorTemp:200, reachable:false}));
        await page.getHue();
        expect(page.display).toEqual("Kontor: Dag\n O B:155 C:200");
    })

    it("adds color when changed", async () => {
        const spy = spyOn(groups.prototype, "getById").and.returnValue(Promise.resolve({on:true, brightness:155, colorTemp:200, reachable:false}));
        await page.getHue();
        expect(page.getDisplay().color).toEqual(5);
        spy.and.returnValue(Promise.resolve({on:true, brightness:155, colorTemp:355, reachable:false}));
        await page.getHue();
        expect(page.getDisplay().color).toEqual(4);
    })
})
