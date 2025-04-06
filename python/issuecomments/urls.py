from django.urls import path
from .views import IssueCommentListCreateView, IssueCommentDetailView

urlpatterns = [
    path('issuecomments/', IssueCommentListCreateView.as_view(), name='issuecomments-list-create'),
    path('issuecomments/<str:pk>/', IssueCommentDetailView.as_view(), name='issuecomments-detail'),
]
