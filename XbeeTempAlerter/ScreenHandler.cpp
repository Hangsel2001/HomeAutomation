// 
// 
// 

#include "ScreenHandler.h"


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
	// TODO: dela upp i metoder som formaterar varje typ av värde
	// TODO: hantera specialtecken som saknas
	// TODO: översätt specialtecken till nya chars
	lcd.setCursor(0, 0);
	printWithLeadingZero(hour());
	lcd.print(":");
	printWithLeadingZero(minute());
	lcd.print(":");
	printWithLeadingZero(second());

	char temp[6];
	dtostrf(topReading, 6, 1, temp);

	lcd.print(temp);
	lcd.print((char)223);
	lcd.print("C");
	lcd.setCursor(0, 1);
	lcd.print(deviceName);
	lcd.print("   ");
	lcd.print(bottomReading, 1);
	lcd.print("%");
}

void ScreenHandler::printWithLeadingZero(int digits) 
{
	// utility function for digital clock display: prints preceding colon and leading 0
	if (digits < 10)
		lcd.print('0');
	lcd.print(digits);
}

// named to avoid conflict with included time.h
void ScreenHandler::setCurrentTime(unsigned long time) 
{ 
	setTime(time);
}

void ScreenHandler::setDeviceName(char* name)
{

}
