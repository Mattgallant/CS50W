from django.db import models
from datetime import datetime, timedelta

# Create your models here.
class Run(models.Model):
	id = models.IntegerField(primary_key=True)
	distance = models.DecimalField(max_digits=8, decimal_places=2, null=True)	# In meters
	elapsed_time = models.IntegerField(null=True)	# In seconds
	start_date = models.DateTimeField(null=True)		# DateTime object, local
	average_speed = models.DecimalField(max_digits=8, decimal_places=2, null=True)	# In meters/second
	max_speed = models.DecimalField(max_digits=8, decimal_places=2, null=True)	# In meters/second
	total_elevation_gain = models.DecimalField(max_digits=8, decimal_places=2, null=True)	# In meters
	elev_high = models.DecimalField(max_digits=8, decimal_places=2, null=True)	# In meters
	elev_low = models.DecimalField(max_digits=8, decimal_places=2, null=True)	# In meters
	notes = models.CharField(max_length = 1000, blank=True)

	def correct_time(self, time):
		new_time = time - timedelta(hours=5)
		return new_time.strftime("%b %d %Y, %I:%M %p")

	def serialize(self):
		""" Return JSON object of the model """
		return {
			"id": self.id,
			"distance": self.distance,
			"elapsed_time": self.elapsed_time,
			"average_speed": self.average_speed,
			"max_speed": self.max_speed,
			"total_elevation_gain": self.total_elevation_gain,
			"elev_high": self.elev_high,
			"elev_low": self.elev_low,
			"start_date": self.correct_time(self.start_date),
			"notes": self.notes
		}
