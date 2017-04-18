// 
// 
// 

#include "ScreenHandler.h"
#include <Arduino.h>

// Should be called in main loop
void ScreenHandler::Do()
{
	if (second() != lastSecond)
	{
		updateLCD();
		lastSecond = second();
	}
}

void ScreenHandler::updateLCD() {
	// TODO: hantera specialtecken som saknas
	// TODO: översätt specialtecken till nya chars

	printTime();
	printTopReading();
	printDeviceName();
	printBottomReading();
}

void ScreenHandler::printTime()
{
	lcd.setCursor(0, 0);
	printWithLeadingZero(hour());
	lcd.print(":");
	printWithLeadingZero(minute());
	lcd.print(":");
	printWithLeadingZero(second());
}

void ScreenHandler::printWithLeadingZero(int digits)
{
	// utility function for digital clock display: prints preceding colon and leading 0
	if (digits < 10)
		lcd.print('0');
	lcd.print(digits);
}

void ScreenHandler::printTopReading()
{
	lcd.setCursor(8, 0);
    formatAndPrintReading(topReading, topReadingType);
}

void ScreenHandler::printDeviceName()
{
	lcd.setCursor(0, 1);

	lcd.print(deviceName);
}

void ScreenHandler::printBottomReading()
{
	lcd.setCursor(8, 1);
	formatAndPrintReading(bottomReading, bottomReadingType);
}

void ScreenHandler::formatAndPrintReading(double reading, int type)
{
	switch (type)
	{
	case READING_TEMPERATURE:
		char temp[7];
		dtostrf(reading, 6, 1, temp);
		lcd.print(temp);
		lcd.print((char)223);
		lcd.print("C");

		break;
	case READING_HUMIDITY:
		lcd.print("   ");
		lcd.print(reading, 1);
		lcd.print("%");
		break;
	}
}

// named to avoid conflict with included time.h
void ScreenHandler::setCurrentTime(unsigned long time) 
{ 
	Serial.print("New time recieved:");
	Serial.println(time);
	setTime(time);
}

void ScreenHandler::setDeviceName(char* name)
{
	deviceName = name;
	Serial.print("Set Device Name:");
	Serial.println(deviceName);
}

void ScreenHandler::setTopReading(double reading, int type)
{
	topReading = reading;
	topReadingType = type;
}

void ScreenHandler::setBottomReading(double reading, int type)
{
	bottomReading = reading;
	bottomReadingType = type;
}