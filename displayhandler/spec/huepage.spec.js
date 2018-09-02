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
    it("updates display scene name", async () => {        
        spyOn(groups.prototype, "getById").and.returnValue(Promise.resolve({on:true, brightness:155, colorTemp:200, reachable:false}));
        spyOn(page, "save").and.returnValue(Promise.resolve());
        await page.down();
        await page.getHue();
        expect(page.display.slice(0,13)).toBe("Kontor: Kväll");
    })

    it("adds color when changed", async () => {
        const spy = spyOn(groups.prototype, "getById").and.returnValue(Promise.resolve({on:true, brightness:155, colorTemp:200, reachable:false}));
        await page.getHue();
        expect(page.getDisplay().color).toEqual(5);
        spy.and.returnValue(Promise.resolve({on:true, brightness:155, colorTemp:355, reachable:false}));
        await page.getHue();
        expect(page.getDisplay().color).toEqual(3);
    })
    describe("sends commands", () => {
        let spy,save;
        beforeEach( async ()=> {
            spy = spyOn(groups.prototype, "getById").and.returnValue(Promise.resolve({on:true, brightness:155, colorTemp:200, reachable:false}));    
            save = spyOn(page, "save").and.returnValue(Promise.resolve());
        });
        it("changes scene", async ()=> {
            await page.down();
            expect(page.scene).toBe(page.config.scenes[1]);
        })
        it("loops scenes", async () => {
            page.sceneIndex = 3;
            await page.down();
            expect(page.scene).toBe(page.config.scenes[0]);
            await page.up();
            expect(page.scene).toBe(page.config.scenes[3]);
        });
        it("sends new scene params", async () => {
            await page.down();
            expect(save.calls.first().args[0]).toEqual({on:true, brightness:144, colorTemp:447, reachable:false});
        })                
    })
})


