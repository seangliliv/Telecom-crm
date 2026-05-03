from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("auth/", include("authentication.urls")),
    path("api/", include("users.urls")),
    path("api/", include("customers.urls")),
    path("api/", include("plans.urls")),
    path("api/", include("subscriptions.urls")),
    path("api/", include("invoices.urls")),
    path("api/", include("transactions.urls")),
    path("api/", include("payment_methods.urls")),
    path("api/", include("support_tickets.urls")),
    path("api/", include("network_status.urls")),
    path("api/", include("system_settings.urls")),
    path("api/", include("audit_logs.urls")),
]
