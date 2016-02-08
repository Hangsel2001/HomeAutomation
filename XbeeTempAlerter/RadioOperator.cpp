#include "RadioOperator.h"
#include <HardwareSerial.h>
#include "time.h"
#include <Arduino.h>

RadioOperator::~RadioOperator()
{
}

int RadioOperator::available() {

	while (serial.available() > 0) {
		int upcomingChar = serial.peek();
		switch (upcomingChar)
		{
		case 1:
			Serial.print("Name: ");
			Serial.print(upcomingChar);
			Serial.print(" ");
			Serial.print((char)upcomingChar);
			handleDeviceName();
			return ro_name_received;
			break;
		case 2:
			if (serial.available() > 4) {
				handleTime();
				return ro_time_received;
			}
			break;
		default:
			Serial.print("Default: ");
			Serial.print(upcomingChar);
			Serial.print(" ");
			Serial.print((char)upcomingChar);
			uint8_t data = serial.read();
			return ro_none;
			break;
		}
	}
	return ro_none;

}

void RadioOperator::handleDeviceName()
{
	uint8_t data = serial.read();
	int i = 0;
	do {
		data = serial.read();
		Serial.print((char)data);
		if (data != 4 && data != 0) {
			deviceName[i++] = data;
		}
	} while (data != 4 && data!=0 && i<8);
}

void RadioOperator::handleTime()
{
	unsigned long data = serial.read(); // removes start byte
	time = 0;
	for (int i = 3; i >= 0; i--) {
		data = serial.read();
		time = time | data << (8 * i);
	}
}

void RadioOperator::sendError(int errorId)
{
	serial.write("E");
	serial.write(errorId);
}

void RadioOperator::sendReadings(double temperature, double humidity)
{
	int serialTemp = (int)(temperature * 100);
	int serialHumidity = (int)(humidity * 100);

	serial.write("T");
	serial.write(serialTemp >> 8);
	serial.write(serialTemp & 0xff);
	serial.write("H");
	serial.write(serialHumidity >> 8);
	serial.write(serialHumidity & 0xff);
}

void RadioOperator::requestCurrentTime()
{
	serial.write("U");
}


void RadioOperator::requestDeviceName()
{
	serial.write("N");
}

unsigned long RadioOperator::getTime()
{
	return time;
}

char& RadioOperator::getDeviceName()
{
	return *deviceName;
}