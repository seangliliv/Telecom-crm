from django.urls import path
from .views import login, logout, check_auth

urlpatterns = [
    path("login/", login, name="login"),
    path("logout/", logout, name="logout"),
    path("check/", check_auth, name="check_auth"),
]