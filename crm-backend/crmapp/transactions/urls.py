# transactions/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("transactions/all/", views.list_transactions, name="list_transactions"),
    path("transactions/", views.create_transaction, name="create_transaction"),
    path("customers/<str:customer_id>/transactions/", views.get_customer_transactions, name="get_customer_transactions"),
]