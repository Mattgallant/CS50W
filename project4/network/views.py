from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from .models import User, Post


def index(request):
    posts = Post.objects.all().order_by('-date')
    paginator = Paginator(posts, 10)

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/index.html", {"page_obj": page_obj, "current_user": request.user})


def profile(request, username):
    profile = User.objects.get(username=username)
    following = len(profile.following.all())
    followers = get_followers(username)

    posts = Post.objects.filter(username = username).order_by('-date')
    paginator = Paginator(posts, 10)

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)


    return render(request, "network/profile.html", {"username": username, "followers": followers, 
        "following": following, "profile": profile, "page_obj":page_obj})

def follow(request, username):
    """
    request.user.username wishes to follow username, this function handles it.
    """
    follower = User.objects.get(username=request.user.username) # The user who wants to follow
    user = User.objects.get(username=username) # The user who will be followed

    follower.following.add(user)
    follower.save()
    return HttpResponseRedirect(reverse("profile", args=(username,)))

def unfollow(request, username):
    """
    request.user.username wishes to unfollow username, this function handles it.
    """
    follower = User.objects.get(username=request.user.username) # The user who wants to unfollow
    user = User.objects.get(username=username) # The user who will be unfollowed

    follower.following.remove(user)
    follower.save()
    return HttpResponseRedirect(reverse("profile", args=(username,)))

@login_required 
def following(request):
    """
    Displays list of people you are following and their posts
    """
    user = request.user
    following = request.user.following.all()

    following_usernames = [user.username for user in following]
    following_posts = Post.objects.filter(username__in=following_usernames).order_by('-date')
    paginator = Paginator(following_posts, 10)

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/following.html", {"following": following, "page_obj": page_obj})


@login_required 
def new_post(request):
    if request.method== "POST":
        content = request.POST["content"]
        username = request.user.username
        post = Post(content = content, username = username)
        post.save()

        return render(request, "network/new.html", {"message": True})
    else:
        return render(request, "network/new.html")

@csrf_exempt
@login_required
def post_api(request, post_id):
    try:
        post = Post.objects.get(pk =post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    if request.method == "GET":
        return JsonResponse(post.serialize())

    # Update whether user liked or unliked
    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("liked") is not None:
            if data["liked"] == True:
                post.likes.add(request.user)
            else:
                post.likes.remove(request.user)
        if data.get("content_changed") is True:
            post.content = data["content"]
        post.save()
        return HttpResponse(status=204)

    # Likes must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)        

# Login, Logout, Register Views, no need to touch
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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")



# Helper functions
def get_followers(username):
    """
    This function returns a list of a user's followers.
    Must check every user's following list, check if username is on it. If so, add.
    """
    followers = []
    user_to_check = User.objects.get(username=username)
    for user in User.objects.all():
        if user_to_check in user.following.all():
            followers.append(user)

    return followers