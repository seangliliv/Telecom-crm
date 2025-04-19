# src/user/urls.py

from django.urls import path
from .views import *

urlpatterns = [
    path("users/", create_user, name="create_user"),          # POST
    path("users/all/", get_all_users, name="get_all_users"),  # GET
    path("users/<str:user_id>/", get_user, name="get_user"),  # GET
    path("users/<str:user_id>/update/", update_user, name="update_user"),  # PUT
    path("users/<str:user_id>/delete/", delete_user, name="delete_user"),  # DELETE
]
