from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField('User', blank=True)

class Post(models.Model):
	content = models.CharField(max_length = 1000)
	date = models.DateTimeField(auto_now_add=True)
	username = models.CharField(max_length = 30)
	likes = models.ManyToManyField(User, blank=True)