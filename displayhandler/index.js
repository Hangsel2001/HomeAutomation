const config = require("config");
const Plate = require("./" + config.get("PlateModule"));
const lcd = new Plate();
const LocationPage= require("./locationpage");
const RailwayPage = require("./railwaypage");
const PageGroup = require("./pagegroup");

let pages = new PageGroup();
pages.on('setup',(config)=> {
    console.log("pages.setup")
    lcd.setup(config);
    lcd.message(pages.getDisplay());
})
pages.setPages( [new RailwayPage(),
    new LocationPage({
    location: "Kontor",
    types: ["temperature", "atmospheric pressure"]
}),
new LocationPage({
    location: "Verkstad",
    types: ["temperature", "humidity"]
})
]);
lcd.backlight(7);
lcd.message(pages.getDisplay());
lcd.on("left", ()=> {
    pages.prev();
});
lcd.on("right", ()=>{
    pages.next();
})
pages.on('update',(text)=> {
	console.log(text);
    lcd.message(text);
})
