from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create", views.create, name="create"),
    path("watchlist", views.watchlist, name="watchlist"),
    path("watchlist/<str:id>", views.watchlist, name="watchlist_add"),
    path("watchlist/remove/<str:id>", views.watchlist_remove, name="watchlist_remove"),
    path("categories", views.categories, name="categories"),
    path("listing/<str:id>", views.listing_page, name="listing_page"),
    path("bid/<str:id>", views.bid, name="bid"),
    path("close/<str:id>", views.close, name="close")
]
