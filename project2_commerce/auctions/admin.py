from django.contrib import admin
from .models import User, Listing, Comment, Bid



class ListingAdmin(admin.ModelAdmin):
	list_display = ("id", "title", "description", "starting_bid")

class CommentAdmin(admin.ModelAdmin):
	list_display = ("id", "user", "listing", "date")

# Register your models here.
admin.site.register(User)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Bid)

