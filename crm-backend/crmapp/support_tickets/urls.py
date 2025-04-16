# support_tickets/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("tickets/all/", views.list_tickets, name="list_tickets"),
    path("tickets/<str:ticket_id>/", views.get_ticket, name="get_ticket"),
    path("tickets/", views.create_ticket, name="create_ticket"),
    path("tickets/<str:ticket_id>/update/", views.update_ticket, name="update_ticket"),
    path("tickets/<str:ticket_id>/messages/", views.add_ticket_message, name="add_ticket_message"),
]