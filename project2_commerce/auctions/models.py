from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    watchlist = models.ManyToManyField('Listing', blank=True)

class Listing(models.Model):
	id = models.AutoField(primary_key=True)
	description = models.CharField(max_length = 500)
	title = models.CharField(max_length = 64)
	starting_bid = models.IntegerField()
	image_url = models.URLField()
	user_id = models.IntegerField()

	def __str__(self):
		return f"{self.title} for bid starting at {self.starting_bid}"


class Comment(models.Model):
	id = models.AutoField(primary_key=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
	body = models.CharField(max_length=500)
	date = models.DateTimeField(auto_now_add=True)


class Bid(models.Model):
	pass
