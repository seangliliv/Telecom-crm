# payment_methods/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("customers/<str:customer_id>/payment-methods/", views.list_payment_methods, name="list_payment_methods"),
    # path("customers/<str:customer_id>/payment-methods/", views.customer_payment_methods, name="customer_payment_methods"),
    path("payment-methods/", views.create_payment_method, name="create_payment_method"),
    path("payment-methods/<str:payment_method_id>/delete/", views.delete_payment_method, name="delete_payment_method"),
    path("invoices/<str:invoice_id>/payment-methods/", views.get_payment_methods_by_invoice, name="get_payment_methods_by_invoice"),
]

