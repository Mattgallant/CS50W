from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .models import Run
# Create your views here.

def index(request):
	return render(request, "exercise/display.html")


def runs(request):
	"""
	API Routes
	Returns a list of all of the run activites in the database.
	"""

	runs = Run.objects.all().order_by("-start_date")
	return JsonResponse([run.serialize() for run in runs], safe=False)

