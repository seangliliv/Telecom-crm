from django.urls import path
from .views import LeadListCreateView, LeadDetailView, LeadCampaignView

urlpatterns = [
    path('leads/', LeadListCreateView.as_view(), name='lead-list'),
    path('leads/<str:pk>/', LeadDetailView.as_view(), name='lead-detail'),
    path('leads/<str:pk>/campaign/', LeadCampaignView.as_view(), name='lead-campaign'),
]