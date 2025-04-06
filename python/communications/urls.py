from django.urls import path
from .views import CommunicationListCreateView, CommunicationDetailView, CommunicationCustomerView

urlpatterns = [
    path('communications/', CommunicationListCreateView.as_view(), name='communication-list'),
    path('communications/<str:pk>/', CommunicationDetailView.as_view(), name='communication-detail'),
    path('communications/<str:pk>/customer/', CommunicationCustomerView.as_view(), name='communication-customer'),
]