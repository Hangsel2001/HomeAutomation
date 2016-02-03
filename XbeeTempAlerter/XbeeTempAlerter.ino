//    FILE: dht_test.ino
//  AUTHOR: Rob Tillaart
// VERSION: 0.1.07
// PURPOSE: DHT Temperature & Humidity Sensor library for Arduino
//     URL: http://arduino.cc/playground/Main/DHTLib
//
// Released to the public domain
//

#include "dht.h"
#include <LiquidCrystal.h>
#include "time.h"
#include <string.h>
#include <EEPROM.h>

dht DHT;
LiquidCrystal lcd(3, 4, 5, 6, 7, 8);
#define DHT22_PIN 2
#define LOCATION "Verkstad"
#define BUTTON_PIN 9
#define HOUR_ADJUST 2

volatile double temperature;
volatile double humidity;
volatile int status = 0;
unsigned long lastRead = 0;
unsigned long lastChange = 0;
volatile unsigned int lastSecond = 0;
bool updatedTime = false;
bool pendingData = false;

void setup()
{
  pinMode(BUTTON_PIN, INPUT_PULLUP);
	delay(3000);
	lcd.begin(16, 2);
	Serial.begin(9600);
	Serial.println("DHT TEST PROGRAM ");
	Serial.print("LIBRARY VERSION: ");
	Serial.println(DHT_LIB_VERSION);
	Serial.println();   
	Serial.println("Type,\tstatus,\tHumidity (%),\tTemperature (C)");
	Serial1.begin(9600);
	Serial1.write("U");
}

void printDigits(int digits) {
	// utility function for digital clock display: prints preceding colon and leading 0
	if (digits < 10)
		lcd.print('0');
	lcd.print(digits);
}

void updateLCD() {
	if (second() != lastSecond) {
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
		lcd.print(LOCATION);
		lcd.print("   ");
		lcd.print(humidity, 1);
		lcd.print("%");
		lastSecond = second();
	}
}

void sendToXbee() {
	int serialTemp = (int)(temperature * 100);
	int serialHumidity = (int)(humidity * 100);
	if (status == 0) {

		Serial1.write("T");
		Serial1.write(serialTemp >> 8);
		Serial1.write(serialTemp & 0xff);
		Serial1.write("H");
		Serial1.write(serialHumidity >> 8);
		Serial1.write(serialHumidity & 0xff);
	}
	else {
		Serial1.write("E");
		Serial1.write(status);
	}
}

void readSensor() {
	status = DHT.read22(DHT22_PIN);
}

void readSerial() {

	while (Serial1.available() > 0) {
		int next = Serial1.peek();

		Serial.println("Receiving");
		// 2 identifies clock update
		if (next == 2 && Serial1.available() > 4) {
	
			unsigned long data = Serial1.read(); // removes start byte
	
			Serial.println("Is 2");
			unsigned long time = 0;
			for (int i = 3; i >= 0; i--) {
				data = Serial1.read();
				
				time = time | data << (8 * i);
				Serial.print(data);
				Serial.print(" ");
				Serial.print(data, BIN);
				Serial.print(" ");
				Serial.print(time, BIN);
				Serial.print(" ");
				Serial.println(time);
			}			
			Serial.println(time);
			setTime(time);
			updatedTime = true;
		}

		if (next == 1) {
			byte data = Serial1.read();
			do{
				data = Serial1.read();
				int i = 0;
				EEPROM.write(i++, data);
			} while (data != 4);
		}
		
	}
}

void loop()
{
     Serial.println(digitalRead(BUTTON_PIN));
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
	}

	readSerial();
	updateLCD();
}
