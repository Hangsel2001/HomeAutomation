const PageGroup = require("../pagegroup");
const DummyPage = require("./helpers/dummypage");


describe("PageGroup", ()=> {
    let group = new PageGroup();
    let dummy1, dummy2;
    beforeEach(()=> {
        group = new PageGroup();       
        dummy1 = new DummyPage("");
        dummy2 = new DummyPage("SecondPage") ;
        group.setPages([
         dummy1, dummy2
        ]);
    });
    it("sets first page as current",()=>{

        expect(group.getDisplay()).toBe(dummy1.getDisplay());
    })
    it("emits on active page", (done)=> {
        
        group.on("update", (message)=> {
            expect(message).toBe("DummyPage\n1");
            done();
        });
        dummy1.trigger();
    })
    it("emits only on active page", (done)=> {
        group.on("update", (message) => {
            expect(message).toBe(dummy2.getDisplay());
            done();
        });
        group.next();
        dummy1.trigger();
        dummy2.trigger();

    });

    it("scrolls to next", ()=>{
        group.next();
        expect(group.getDisplay()).toBe(dummy2.getDisplay());
        group.next();
        expect(group.getDisplay()).toBe(dummy1.getDisplay());
    });

    it("scrolls to prev", ()=>{
        group.next();
        group.prev();
        expect(group.getDisplay()).toBe(dummy1.getDisplay());
        group.prev();
        expect(group.getDisplay()).toBe(dummy2.getDisplay());
    });
});