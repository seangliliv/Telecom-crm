from django.urls import path
from .views import UserListCreateView, UserDetailView, UserRolesView

urlpatterns = [
    path('users/', UserListCreateView.as_view(), name='user-list'),
    path('users/<str:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<str:pk>/roles/', UserRolesView.as_view(), name='user-roles'),
]