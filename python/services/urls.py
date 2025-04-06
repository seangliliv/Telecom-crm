from django.urls import path
from .views import ServiceListCreateView, ServiceDetailView

urlpatterns = [
    path('services/', ServiceListCreateView.as_view(), name='service-list'),
    path('services/<str:pk>/', ServiceDetailView.as_view(), name='service-detail'),
]