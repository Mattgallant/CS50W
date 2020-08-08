''' This file gets data from the Strava API and stores it into the database. 
Runs on a set timer OR has to be run manually to populate the DB '''
import os
import requests
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "final.settings")
django.setup()
from exercise.models import Run

# Get access token from refresh tokens
authorization_url = "https://www.strava.com/api/v3/oauth/token"

payload = {
	'client_id': "52060",
	'client_secret': "6e4eea7083ce38b00682e0142d21b93119914cdb",
	'refresh_token': os.environ["REFRESH_TOKEN"],
	'grant_type': "refresh_token",
	'f': 'json'
}

print("Requesting Token...\n")
res = requests.post(authorization_url, data=payload, verify=False)
access_token = res.json()['access_token']
print(f"Access Token = {access_token}")

# Used access token, get JSON activites data
activities_url= "https://www.strava.com/api/v3/athlete/activities?access_token="

header = {'Authorization': 'Bearer ' + access_token}
parameters = {'per_page': 200, 'page':1}
data = requests.get(activities_url , headers=header, params=parameters).json()

print("Data Successfully Received..... Storing in DB")

for run_data in data:
	run = Run(id = run_data['id'], distance= run_data['distance'], elapsed_time=run_data['elapsed_time'], start_date=run_data['start_date'],
		average_speed=run_data['average_speed'], max_speed=run_data['max_speed'], total_elevation_gain=run_data['total_elevation_gain'],
		elev_high=run_data['elev_high'], elev_low=run_data['elev_low'])
	run.save()
	print(f"Saving run ID: {run_data['id']}")