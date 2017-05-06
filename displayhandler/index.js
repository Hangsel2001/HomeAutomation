const lcd = new (require("./rgbpiplate"))();
const LocationPage= require("./locationpage");
let page = new LocationPage({
    location: "Kontor",
    types: ["temperature", "atmospheric pressure"]
});
lcd.backlight(3);
page.on('update',(text)=> {
    lcd.message(text);
})