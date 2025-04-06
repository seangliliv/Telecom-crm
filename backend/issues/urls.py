from django.urls import path
from .views import IssueListCreateView, IssueDetailView, IssueResolveView

urlpatterns = [
    path('issues/', IssueListCreateView.as_view(), name='issue-list'),
    path('issues/<str:pk>/', IssueDetailView.as_view(), name='issue-detail'),
    path('issues/<str:pk>/resolve/', IssueResolveView.as_view(), name='issue-resolve'),
]