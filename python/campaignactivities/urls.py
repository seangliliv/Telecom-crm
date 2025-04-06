from django.urls import path
from .views import CampaignActivityListCreateView, CampaignActivityDetailView, CampaignActivityCampaignView

urlpatterns = [
    path('activities/', CampaignActivityListCreateView.as_view(), name='campaignactivity-list'),
    path('activities/<str:pk>/', CampaignActivityDetailView.as_view(), name='campaignactivity-detail'),
    path('activities/<str:pk>/campaign/', CampaignActivityCampaignView.as_view(), name='campaignactivity-campaign'),
]