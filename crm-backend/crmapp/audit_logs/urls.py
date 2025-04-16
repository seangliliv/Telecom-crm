# audit_logs/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("audit-logs/all/", views.list_audit_logs, name="list_audit_logs"),
    path("audit-logs/", views.create_audit_log, name="create_audit_log"),
]