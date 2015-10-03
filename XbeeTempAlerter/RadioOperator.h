#pragma once

#ifndef radio_operator
#define radio_operator
#define ro_none 0;
#define ro_name_received 1
#define ro_time_received 2
#define ro_message_pending_received 3

#include <HardwareSerial.h>

class RadioOperator
{
private:
	unsigned long time;
	Stream & serial;
	char deviceName[9];
	void handleTime();
	void handleDeviceName();
public:
	RadioOperator(Stream& serial_) : serial(serial_) {};
	~RadioOperator();
	int available();
	void sendError(int errorId);
	void sendReadings(double temperature, double humidity);
	void requestCurrentTime();
	unsigned long getTime();
	char& getDeviceName();
};

#endif