let lp = require("../locationpage");
describe("LocationPage", () => {
    let page = new lp.LocationPage();
    it("has Kontor title", () => {
        expect(page.title).toBe("Kontor");
    })
    it("contains watch", ()=> {
        expect(page.line1).toBe("23:34:18");
    })
})