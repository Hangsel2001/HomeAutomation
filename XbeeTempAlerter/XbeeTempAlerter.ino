#include "dht.h"
#include <LiquidCrystal.h>
#include "time.h"
#include <string.h>
#include <EEPROM.h>
#include "RadioOperator.h"

dht DHT;
LiquidCrystal lcd(3, 4, 5, 6, 7, 8);
RadioOperator radioOperator(Serial1);
#define DHT22_PIN 2
#define BUTTON_PIN 9
#define HOUR_ADJUST 2

int dhtStatus = 1;
double temperature;
double humidity;
unsigned long lastRead = 0;
unsigned long lastChange = 0;
volatile unsigned int lastSecond = 0;
bool updatedTime = false;
bool pendingData = false;
char deviceName[9] = "        ";

void setup()
{
	pinMode(BUTTON_PIN, INPUT_PULLUP);

	Serial1.begin(9600);
	radioOperator.requestCurrentTime();

	delay(3000); // give DHT a chance to get started before proceeding

	lcd.begin(16, 2);

	Serial.begin(9600);
	Serial.println("XbeeTempAlerter");
	Serial.println("Ver 0.1 2015-10-03");

	loadDeviceNameFromEEPROM();

}

void loadDeviceNameFromEEPROM()
{
	for (int i = 0; i < 8; i++)
	{
		deviceName[i] = EEPROM.read(i);
		Serial.print("EERPOM ");
		Serial.print(i);
		Serial.print(" : ");
		Serial.println(deviceName[i]);
	}
}

void writeDeviceNametoEEPROM()
{
	Serial.print("Updating EEPROM with ");
	Serial.println(deviceName);
	for (int i = 0; i < 8; i++) {
		EEPROM.write(i, deviceName[i]);
		Serial.print("EERPOM ");
		Serial.print(i);
		Serial.print(" : ");
		Serial.println(deviceName[i]);
	}
}

void loop()
{
	if (millis() - lastRead > 3000) {
		
		getReadings();
		transmitReadings();

		lastRead = millis();
	}

	getIncoming();
	getButton();

	if (second() != lastSecond) {

		updateLCD();

		lastSecond = second();
	}
}

void getReadings() {
	dhtStatus = DHT.read22(DHT22_PIN);
	Serial.print("Status: ");
	Serial.println(dhtStatus);

	if (dhtStatus == DHTLIB_OK)
	{
		temperature = DHT.temperature;
		humidity = DHT.humidity;
	}
}

void transmitReadings()
{
	if (dhtStatus != DHTLIB_OK)
	{
		radioOperator.sendError(dhtStatus);
	}
	else
	{
		radioOperator.sendReadings(temperature, humidity);
	}
}

void getIncoming()
{
	int status = radioOperator.available();
	switch (status)
	{
	case ro_time_received:
		setTime(radioOperator.getTime());
		break;
	case ro_name_received:
		//deviceName = radioOperator.getDeviceName();
		break;
	default:
		break;
	}

}

void getButton() {};

void updateLCD() {
	lcd.setCursor(0, 0);
	printDigits(hour());
	lcd.print(":");
	printDigits(minute());
	lcd.print(":");
	printDigits(second());

	char temp[6];
	dtostrf(temperature, 6, 1, temp);

	lcd.print(temp);
	lcd.print((char)223);
	lcd.print("C");
	lcd.setCursor(0, 1);
	lcd.print(deviceName);
	lcd.print("   ");
	lcd.print(humidity, 1);
	lcd.print("%");
}

void printDigits(int digits) {
	// utility function for digital clock display: prints preceding colon and leading 0
	if (digits < 10)
		lcd.print('0');
	lcd.print(digits);
}
