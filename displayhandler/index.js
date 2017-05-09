const config = require("config");
const Plate = require("./" + config.get("PlateModule"));
const lcd = new Plate();
const LocationPage= require("./locationpage");
const PageGroup = require("./pagegroup");

let pages = new PageGroup();
pages.setPages( [new LocationPage({
    location: "Kontor",
    types: ["temperature", "atmospheric pressure"]
}),
new LocationPage({
    location: "Verkstad",
    types: ["temperature", "humidity"]
})]);
lcd.backlight(7);
lcd.message(pages.getDisplay());
lcd.on("left", ()=> {
    pages.prev();
});
lcd.on("right", ()=>{
    pages.next();
})
pages.on('update',(text)=> {
    lcd.message(text);
})