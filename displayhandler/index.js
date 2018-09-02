process.env.NODE_CONFIG_DIR = __dirname + "/config";
const config = require("config");
const Plate = require("./" + config.get("PlateModule"));
const lcd = new Plate();
const LocationPage= require("./locationpage");
const RailwayPage = require("./railwaypage");
const PageGroup = require("./pagegroup");
const HuePage = require("./huepage");

let pages = new PageGroup();
pages.on('setup',(config)=> {
    console.log("pages.setup")
    lcd.setup(config);
    handleDisplayUpdate(pages.getDisplay());
})
pages.setPages( [HuePage.getPage(), RailwayPage.getPage(),
    new LocationPage({
    location: "Kontor",
    types: ["temperature", "atmospheric pressure"]
}),
new LocationPage({
    location: "Verkstad",
    types: ["temperature", "humidity"]
})
]);
lcd.on("left", ()=> {
    pages.prev();
});
lcd.on("right", ()=>{
    pages.next();
})
lcd.on("down", ()=> {
    pages.down();
})
lcd.on("up", ()=> {
    pages.up();
})
pages.on('update',(text)=> {
	handleDisplayUpdate(text);
})

function handleDisplayUpdate(text) {
    if (text.color) {
        lcd.backlight(text.color);
        text = text.text;
    }
    lcd.message(text);
}

