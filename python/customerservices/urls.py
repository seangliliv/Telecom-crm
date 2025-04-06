from django.urls import path
from .views import CustomerServiceListCreateView, CustomerServiceDetailView, CustomerServiceCustomerView

urlpatterns = [
    path('customerservices/', CustomerServiceListCreateView.as_view(), name='customerservice-list'),
    path('customerservices/<str:pk>/', CustomerServiceDetailView.as_view(), name='customerservice-detail'),
    path('customerservices/<str:pk>/customer/', CustomerServiceCustomerView.as_view(), name='customerservice-customer'),
]