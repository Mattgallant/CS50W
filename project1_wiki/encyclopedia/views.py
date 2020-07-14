from django.shortcuts import render, HttpResponse, redirect, HttpResponseRedirect
from django import forms

from . import util

import markdown2
from random import choice


def index(request):
    return render(request, "encyclopedia/index.html", {"entries": util.list_entries()})

def wikipage(request, title):
	""" Handles the displaying of a wiki page being visited. """
	page_contents = util.get_entry(title)

	if page_contents is None:
		# Load error page
		return render(request, "encyclopedia/error.html")

	# Load page, display MD file to HTML. 
	markdowner = markdown2.Markdown()
	page_contents = markdowner.convert(page_contents)
	return render(request, "encyclopedia/page.html", {"title": title, "body": page_contents})

def search(request):
	query = request.POST.get('query')
	if util.get_entry(query) is None:
		# Display all resulting substrings
		entries = util.list_entries()
		matches = []
		for entry in entries:
			if query.lower() in entry.lower():
				matches.append(entry)

		return render(request, "encyclopedia/search_results.html", {"entries": matches})

	return wikipage(request, query)


def new(request, headline="Create a new page"):
	""" Handles the form to add new post and the processing of new page"""
	return render(request, "encyclopedia/new.html", {"headline": headline})

def post(request):
	title = request.POST.get('title')
	content = request.POST.get('content')
	print(title)
	print(content)
	if title in util.list_entries():
		print("okay")
		return render(request, "encyclopedia/new_error.html")
	else:
		# save entry
		util.save_entry(title, content)
		return wikipage(request, title)


def edit(request, title):
	if request.method =='POST':         # Register user
		util.save_entry(title, request.POST.get('content'))
		return HttpResponseRedirect("../wiki/{}".format(title))
	else:
		# GET request, display edit page
		page_contents = util.get_entry(title)
		return render(request, "encyclopedia/edit.html", {"title": title, "body": page_contents})

def random(request):
	""" Chooses and displays a random page from the entries""" 
	entries = util.list_entries()
	random_entry = choice(entries)
	return wikipage(request, random_entry)





