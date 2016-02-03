#include "dht.h"
#include <LiquidCrystal.h>
#include <string.h>
#include <EEPROM.h>
#include "RadioOperator.h"
#include "ScreenHandler.h"

dht DHT;
LiquidCrystal lcd(3, 4, 5, 6, 7, 8);
ScreenHandler screen(lcd);
RadioOperator radioOperator(Serial1);
#define DHT22_PIN 2
#define BUTTON_PIN 9
#define HOUR_ADJUST 2

int dhtStatus = 1;
double temperature;
double humidity;
unsigned long lastRead = 0;
unsigned long lastChange = 0;

bool updatedTime = false;
bool pendingData = false;


void setup()
{
	delay(3000);
	lcd.begin(16, 2);
	Serial.begin(9600);
	Serial.println("DHT TEST PROGRAM ");
	Serial.print("LIBRARY VERSION: ");
	Serial.println(DHT_LIB_VERSION);
	Serial.println();
	Serial.println("Type,\tstatus,\tHumidity (%),\tTemperature (C)");
	Serial1.begin(9600);
	radioOperator.requestCurrentTime();

	delay(3000); // give DHT a chance to get started before proceeding

	lcd.begin(16, 2);

	Serial.begin(9600);
	Serial.println("XbeeTempAlerter");
	Serial.println("Ver 0.1 2015-10-03");

	screen.setDeviceName(loadDeviceNameFromEEPROM());
}

char * loadDeviceNameFromEEPROM()
{
	char deviceName[] = "        ";
	for (int i = 0; i < 8; i++)
	{
		deviceName[i] = EEPROM.read(i);
		Serial.print("EERPOM ");
		Serial.print(i);
		Serial.print(" : ");
		Serial.println(deviceName[i]);
	}
	return deviceName;
}

void writeDeviceNametoEEPROM(char* deviceName)
{
	Serial.print("Updating EEPROM with ");
	Serial.println(*deviceName);
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
	if (millis() -lastRead > 3000) {
		readSensor();
		temperature = DHT.temperature;
		humidity = DHT.humidity;
		Serial.println("Send to Serial");
		sendToXbee();
		lastRead = millis();
		if (!updatedTime) {
			Serial.println("Not updated");
			Serial1.write("U");
		}

void setNewDeviceName(char * deviceName) {
	writeDeviceNametoEEPROM(deviceName);
	screen.setDeviceName(deviceName);
	}

void getButton() {};


void printDigits(int digits) {
	// utility function for digital clock display: prints preceding colon and leading 0
	if (digits < 10)
		lcd.print('0');
	lcd.print(digits);
}
