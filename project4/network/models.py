from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('User', blank=True)

class Post(models.Model):
	content = models.CharField(max_length = 1000)
	date = models.DateTimeField(auto_now_add=True)
	username = models.CharField(max_length = 30)
	likes = models.ManyToManyField(User, blank=True)
	id = models.AutoField(primary_key=True)

	def serialize(self):
		return {
			"id": self.id,
			"content": self.content,
			"username": self.username,
			"likes": [user.username for user in self.likes.all()],
			"date": self.date.strftime("%b %d %Y, %I:%M %p")
		}