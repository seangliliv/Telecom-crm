from django.urls import path
from .views import RoleListCreateView, RoleDetailView, RoleUsersView

urlpatterns = [
    path('roles/', RoleListCreateView.as_view(), name='role-list'),
    path('roles/<str:pk>/', RoleDetailView.as_view(), name='role-detail'),
    path('roles/<str:pk>/users/', RoleUsersView.as_view(), name='role-users'),
]