from django.urls import path
from .views import InvoiceListCreateView, InvoiceDetailView, InvoiceProcessView

urlpatterns = [
    path('invoices/', InvoiceListCreateView.as_view(), name='invoice-list'),
    path('invoices/<str:pk>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('invoices/<str:pk>/process/', InvoiceProcessView.as_view(), name='invoice-process'),
]