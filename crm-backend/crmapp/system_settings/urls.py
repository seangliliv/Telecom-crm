# system_settings/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("settings/", views.get_system_settings, name="get_system_settings"),
    path("settings/<str:category>/", views.get_system_settings, name="get_system_settings_by_category"),
    path("settings/update/", views.update_system_settings, name="update_system_settings"),
]
