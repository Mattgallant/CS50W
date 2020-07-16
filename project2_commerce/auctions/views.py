from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, Listing, Comment


def index(request):
    return render(request, "auctions/index.html", {"listings": Listing.objects.all()})


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    """ Logs the user out and redirects them to the index page """
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")


@login_required 
def create(request):
    if request.method== "POST":
        title = request.POST["title"]
        description = request.POST["description"]
        image_url = request.POST["image_url"]
        price = request.POST["price"]

        listing = Listing(description = description, title=title, starting_bid=price, image_url=image_url)
        listing.save()
        return render(request, "auctions/create.html", {"message": f"Successfully listed {title}"})
    else:
        return render(request, "auctions/create.html")


def categories(request):
    return HttpResponse("Not yet implemented cunt")

@login_required 
def watchlist(request, id=None):
    user = User.objects.get(username=request.user.username)
    if id is not None:
        desired_add = Listing.objects.get(pk=id)
        user.watchlist.add(desired_add)
        user.save()

        return HttpResponseRedirect(reverse("listing_page", args=(id,)))
    listings = user.watchlist.all()
    return render(request, "auctions/watchlist.html", {"listings": listings})

@login_required 
def watchlist_remove(request, id):
    """ Removes a listing from user's watchlist """
    user = User.objects.get(username=request.user.username)
    listing = Listing.objects.get(pk=id)
    user.watchlist.remove(listing)
    user.save()

    return HttpResponseRedirect(reverse("listing_page", args=(id,)))

def listing_page(request, id):
    """ Displays information about a listing, determines whether or not on watchlist """
    listing = Listing.objects.get(pk=id)
    user = User.objects.get(username=request.user.username)

    if request.method== "POST":
        # handle leaving a comment
        body = request.POST["body"]
        new_comment = Comment(user=user, listing=listing, body=body)
        new_comment.save()
        return HttpResponseRedirect(reverse("listing_page", args=(id,)))
    else:
        # Display the listing page and all relevant info
        comments = Comment.objects.filter(listing=listing).all()

        user_watchlist = user.watchlist.all()
        on_watchlist = True if listing in user_watchlist else False     # Get list of Listings of User watchlist, check if Listing with ID On
        listing = Listing.objects.get(pk=id)
        return render(request, "auctions/listing_page.html", {"listing": listing, "on_watchlist": on_watchlist, "comments": comments})