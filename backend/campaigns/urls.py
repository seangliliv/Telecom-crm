from django.urls import path
from .views import CampaignListCreateView, CampaignDetailView, CampaignStartView

urlpatterns = [
    path('campaigns/', CampaignListCreateView.as_view(), name='campaign-list'),
    path('campaigns/<str:pk>/', CampaignDetailView.as_view(), name='campaign-detail'),
    path('campaigns/<str:pk>/start/', CampaignStartView.as_view(), name='campaign-start'),
]