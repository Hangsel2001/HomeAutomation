// ScreenHandler.h
#pragma once
#include "time.h"
#include <LiquidCrystal.h>


class ScreenHandler
{
private:
	void printWithLeadingZero(int digits);
	LiquidCrystal & lcd;
	unsigned int lastSecond = 0;
	char  * deviceName;
	double topReading;
	double bottomReading;
public:
	ScreenHandler(LiquidCrystal & lcd_) : lcd(lcd_) { };
	~ScreenHandler() {};
	void Do();
	void updateLCD();
	void setCurrentTime(unsigned long time);
	void setDeviceName(char* name);
	void buttonPressed();
};