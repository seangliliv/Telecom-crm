from django.urls import path
from .views import SubscriptionListCreateView, SubscriptionDetailView

urlpatterns = [
    path('subscriptions/', SubscriptionListCreateView.as_view(), name='subscription-list'),
    path('subscriptions/<str:pk>/', SubscriptionDetailView.as_view(), name='subscription-detail'),
]