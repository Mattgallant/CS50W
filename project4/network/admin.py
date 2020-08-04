from django.contrib import admin
from .models import User, Post


class UserAdmin(admin.ModelAdmin):
	list_display= ("username", "email")

class PostAdmin(admin.ModelAdmin):
	list_display=("username", "date", "content")


admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)

