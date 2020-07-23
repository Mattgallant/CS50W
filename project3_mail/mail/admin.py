from django.contrib import admin

from .models import Email


class EmailAdmin(admin.ModelAdmin):
	list_display = ("sender", "subject", "body")


admin.site.register(Email, EmailAdmin)

# Register your models here.
