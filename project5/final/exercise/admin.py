from django.contrib import admin
from .models import Run


class RunAdmin(admin.ModelAdmin):
	list_display=("id", "start_date", "distance", "elapsed_time", "notes")

# Register your models here.
admin.site.register(Run, RunAdmin)
