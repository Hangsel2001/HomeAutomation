const PiPlate = require('adafruit-i2c-lcd').plate;
let lcd = new PiPlate(0, 0x20);

lcd.createChar(1, [0,0,14,4,31,31,31,10]); //lok nos
lcd.createChar(2, [14,21,21,21,31,31,31,4]); // lok bak
lcd.createChar(3, [	16,16,16,16,16,16,16,16]); // |
lcd.createChar(4, [0,0,0,0,31,4,2,1]); // -\-
lcd.createChar(5, [0,0,0,0,24,4,2,1]); // -\
lcd.createChar(6, [0,0,0,0,31,0,0,0]); // -
lcd.createChar(7, [	0,0,0,0,31,1,2,4]); // -/-
lcd.createChar(8, [4,8,16,16,0,0,0,0]); // -/

lcd.clear();
lcd.backlight(lcd.colors.RED);
lcd.message('\x06\x06\x06\x06\x07\x06\x06\x01\x02\x06\x06\x04\x06\x06\x05\n\x06\x06\x06\x06\x08       \x03  \x03', true);