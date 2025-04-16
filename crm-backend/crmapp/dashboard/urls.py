# dashboard/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/admin/", views.admin_dashboard, name="admin_dashboard"),
    path("dashboard/user/<str:user_id>/", views.user_dashboard, name="user_dashboard"),
]