from django.urls import path
from .views import *

urlpatterns = [
    path("invoices/all/", list_invoices, name="list_invoices"),
    path("invoices/<str:invoice_id>/", get_invoice, name="get_invoice"),
    path("invoices/", create_invoice, name="create_invoice"),
    path("invoices/update/<str:invoice_id>/", update_invoice, name="update_invoice"),
    path("invoices/delete/<str:invoice_id>/", delete_invoice, name="delete_invoice"),
]
