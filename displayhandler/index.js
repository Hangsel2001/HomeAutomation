const config = require("config");
const Plate = require("./" + config.get("PlateModule"));
const lcd = new Plate();
const LocationPage= require("./locationpage");

let page = new LocationPage({
    location: "Kontor",
    types: ["temperature", "atmospheric pressure"]
});
lcd.backlight(7);
page.on('update',(text)=> {
    lcd.message(text);
})