# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserViewSet, CustomerViewSet, PlanViewSet, SubscriptionViewSet,
    InvoiceViewSet, TransactionViewSet, PaymentMethodViewSet,
    SupportTicketViewSet, NetworkStatusViewSet, SystemSettingsViewSet,
    AuditLogViewSet, DashboardViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'plans', PlanViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'payment-methods', PaymentMethodViewSet, basename='payment-method')
router.register(r'tickets', SupportTicketViewSet)
router.register(r'network/status', NetworkStatusViewSet)
router.register(r'system/settings', SystemSettingsViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')

urlpatterns = [
    # JWT authentication
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh-token/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]