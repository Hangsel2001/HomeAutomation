# -*- coding: UTF-8 -*-
#!/usr/bin/python
# Example using a character LCD plate.

import math
import time
from datetime import datetime
from measurementsdbcontext import MeasurementsDBContext

import Adafruit_CharLCD as LCD


# Initialize the LCD using the pins 
lcd = LCD.Adafruit_CharLCDPlate()
db = MeasurementsDBContext()

lcd.set_color(0.0, 1.0, 0.0)

lastpresentation = ""

device = 0
devices = 2
lcdLeftPressed = False
lcdRightPressed = False

while True:
	starttime = datetime.now()
	if device == 0:
		actualtemp = db.getLatest("Kontor","temperature");
		actualpressure = db.getLatest("Kontor", "atmospheric pressure");
		temp = "----\xDFC"
		pressure = "----hPa"
		presentation = ""
		if actualtemp != None:
			temp = str(round(actualtemp, 1)) + "\xDFC";
		if actualpressure != None:
			pressure = str(int(round(actualpressure, 0))) + "hPa"
		presentation= time.strftime('%H:%M:%S') + temp.rjust(8) + "\n" + "Kontor  " + pressure.rjust(8)
	if device == 1:
		actualtemp = db.getLatest("Verkstad","temperature");
		actualhum = db.getLatest("Verkstad", "humidity");
		temp = "----\xDFC"
		hum = "----%"
		presentation = ""
		if actualtemp != None:
			temp = str(round(actualtemp, 1)) + "\xDFC";
		if actualhum != None:
			hum = str(round(actualhum, 1)) + "%";
		presentation= time.strftime('%H:%M:%S') + temp.rjust(8) + "\n" + "Verkstad" + hum.rjust(8)

	if lastpresentation != presentation:
		#lcd.clear();
		lcd.set_cursor(0,0)
		lcd.message(presentation)
		lastpresentation = presentation
	time.sleep((datetime.now() - starttime).microseconds/1000000);

	if lcd.is_pressed(LCD.LEFT):
		lcdLeftPressed = True
	elif lcdLeftPressed == True:
		lcdLeftPressed = False
		if device > 0:
			device -= 1

	if lcd.is_pressed(LCD.RIGHT):
		lcdRightPressed = True
	elif lcdRightPressed == True:
		lcdRightPressed = False
		if device < devices -1:
			device += 1
