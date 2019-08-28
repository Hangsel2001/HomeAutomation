# HomeAutomation

## Overview

Detta är ett samlingsprojekt för automatiserade delar i mitt hus. Det är under extremt långsam utveckling och innefattar inga kritiska delar. 
De just nu aktiva delarna är installerade på en RPI1 med en adafruit färg-2x16LCD som är monterade på en vägg som jag kallar PiPlate. 

## PiPlate

- Behöver MySQL
	- Script finns i Setup-mappen
	- Lösenord är hårdkodade men ska bara vara uppsatta för lokal access.

### PM2

- Starta i rotmappen med 
```bash
     pm2 start ecosystem.config.js
```
- Spara för automatisk uppstart med 
```bash
     pm2 save
     pm2 startup
```
- Kör sedan scriptet som visas
- Installera loggbegränsare med
```bash
     pm2 install pm2-logrotate
```