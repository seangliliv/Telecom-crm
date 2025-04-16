# network_status/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("network/status/all/", views.get_network_status, name="get_network_status"),
    path("network/status/", views.create_network_status, name="create_network_status"),
    path("network/status/<str:status_id>/update/", views.update_network_status, name="update_network_status"),
]