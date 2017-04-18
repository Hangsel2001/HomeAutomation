// ScreenHandler.h
#pragma once
#include "time.h"
#include <LiquidCrystal.h>

#define READING_TEMPERATURE 0
#define READING_HUMIDITY 1
#define READING_PRESSURE 2

class ScreenHandler
{
private:
	void printWithLeadingZero(int digits);
	void printTime();
	void printDeviceName();
	void printTopReading();
	void printBottomReading();
	void formatAndPrintReading(double reading, int type);
	LiquidCrystal & lcd;
	unsigned int lastSecond = 0;
	char * deviceName;
	double topReading;
	int topReadingType;
	double bottomReading;
	int bottomReadingType;

//	bool isShowingMessage();
	char * message;
	int messageLength;
	int messageLocation;
public:
	ScreenHandler(LiquidCrystal & lcd_) : lcd(lcd_) { };
	~ScreenHandler() {};
	void Do();
	void updateLCD();
	void setCurrentTime(unsigned long time);
	void setDeviceName(char* name);
//	void buttonPressed();
	void setTopReading(double reading, int type);
	void setBottomReading(double reading, int type);
};