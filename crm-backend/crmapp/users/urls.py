from django.urls import path
from .views import *

urlpatterns = [
    path("users/", create_user, name="create_user"),
    path("users/all/", get_all_users, name="get_all_users"),
    path("users/<str:user_id>/", get_user, name="get_user"),
    path("users/<str:user_id>/update/", update_user, name="update_user"),
    path("users/<str:user_id>/delete/", delete_user, name="delete_user")
]
