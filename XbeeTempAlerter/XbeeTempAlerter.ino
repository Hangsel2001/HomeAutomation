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
char deviceNameBuffer[9];

bool updatedTime = false;
bool pendingData = false;


void setup()
{
	pinMode(BUTTON_PIN, INPUT_PULLUP);

	delay(1000);
	Serial.begin(9600);
	Serial.println("XbeeTempAlerter");
	Serial.println("Ver 0.1 2015-10-03");

	Serial1.begin(9600);
//	Serial.println("Requesting Time");
//	radioOperator.requestCurrentTime();
	Serial.println("Requesting Name");
	radioOperator.requestDeviceName();
	Serial.println("Init thermometer");

	delay(3000); // give DHT a chance to get started before proceeding

	lcd.begin(16, 2);


	loadDeviceNameFromEEPROM(deviceNameBuffer);

	screen.setDeviceName(deviceNameBuffer);
}

void loadDeviceNameFromEEPROM(char * deviceName)
{
	for (int i = 0; i < 8; i++)
	{
		deviceName[i] = EEPROM.read(i);
		Serial.print("EERPOM ");
		Serial.print(i);
		Serial.print(" : ");
		Serial.println(deviceName[i]);
		
	}
	deviceName[8] = 0;
	Serial.println(deviceName);
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
		printReadings();
		transmitReadings();
		lastRead = millis();
	}

	getIncoming();
	getButton();
	screen.Do();


}

void getReadings() {
	dhtStatus = DHT.read22(DHT22_PIN);


	if (dhtStatus == DHTLIB_OK)
	{
		temperature = DHT.temperature;
		humidity = DHT.humidity;
	}
}

void printReadings() {
	screen.setTopReading(temperature, READING_TEMPERATURE);
	screen.setBottomReading(humidity, READING_HUMIDITY);
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
	if (status != 0) {
		Serial.print("Status: ");
		Serial.println(status);
	}
	switch (status)
	{
	case ro_time_received:
		screen.setCurrentTime(radioOperator.getTime());
		break;
	case ro_name_received:
		Serial.println("ro_name_received");
		setNewDeviceName(&radioOperator.getDeviceName());
		break;
	case ro_message_pending_received:
		break;
	case ro_message_received:
		break;
	case ro_readings_received:
		break;
	default:
		break;
	}

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
