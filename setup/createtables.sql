CREATE DATABASE measurements;
USE measurements;

GRANT ALL PRIVILEGES ON measurements.* TO 'monitor'@'localhost';

USE measurements;

DROP TABLE measurements;
DROP TABLE current_measurements;
DROP TABLE devices;
CREATE TABLE devices (
	shortname VARCHAR(8),
	name VARCHAR(30),
	description VARCHAR(256),
	location VARCHAR(256),
	locationtype ENUM('outdoors', 'indoors'),
	PRIMARY KEY(shortname)
);

CREATE TABLE measurements (
	time DATETIME, 
	devicename VARCHAR(8) NOT NULL,
	type ENUM('temperature','atmospheric pressure','humidity','soil moisture','rain','wind direction','wind speed'), 
	value DECIMAL(20,8),
	FOREIGN KEY (devicename) REFERENCES devices(shortname) ON DELETE RESTRICT,
	PRIMARY KEY(devicename, type, time)
);

CREATE TABLE current_measurements (
	time DATETIME, 
	devicename VARCHAR(8) NOT NULL,
	type ENUM('temperature','atmospheric pressure','humidity','soil moisture','rain','wind direction','wind speed'), 
	value DECIMAL(20,8),
	FOREIGN KEY (devicename) REFERENCES devices(shortname) ON DELETE RESTRICT,
	PRIMARY KEY(devicename, type)
) ENGINE = MEMORY;

INSERT INTO devices(shortname, name, description,location, locationtype)
	values('Verkstad', 'Verkstaden', 'Verkstad och förråd i carporten', 'Carporten', 'indoors'),
	('Kontor', 'Kontoret', 'Kontoret och verkstaden på våning 2', 'Övervåning', 'indoors' )	;

