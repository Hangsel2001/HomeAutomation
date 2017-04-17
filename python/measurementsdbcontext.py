import MySQLdb
import time
from datetime import datetime

class MeasurementsDBContext:
	def __init__(self):
		self.db = MySQLdb.connect("localhost", "root", "Vulcan2001!", "measurements")
		self.curs=self.db.cursor()
		self.lastlog = dict()
		self.logspan = 30

	def add(self, devicename, measurementType, value):
		#print measurementType
		#print value
		if measurementType not in self.lastlog.keys():
			self.lastlog[measurementType] = datetime(1,1,1)
		self.curs.execute("REPLACE INTO current_measurements (time, devicename, type, value) VALUES (%s, %s, %s, %s)", (time.strftime('%Y-%m-%d %H:%M:%S'),devicename,measurementType,value))
		self.db.commit()
		if (datetime.now() - self.lastlog[measurementType]).total_seconds() >= self.logspan:
			self.lastlog[measurementType] = datetime.now()
			self.curs.execute("INSERT INTO measurements (time, devicename, type, value) VALUES (%s, %s, %s, %s)", (time.strftime('%Y-%m-%d %H:%M:%S'), devicename,measurementType,value))
			self.db.commit()
		#print "Inserted"

	def getLatest(self, devicename, measurementType):
		self.curs.execute("SELECT value FROM current_measurements WHERE type = %s AND devicename = %s LIMIT 1", (measurementType, devicename))
		val = None
		rows = self.curs.fetchall()
		if len(rows) > 0:
			val = rows[0][0]


	#	if len(val) = 0:
	#		self.curs.execute("SELECT value FROM measurements WHERE type = %s AND devicename = %s ORDER BY time DESC LIMIT 1", (measurementType, devicename))
	#		val = self.curs.fetchall()[0][0]

		self.db.commit()

		return val

