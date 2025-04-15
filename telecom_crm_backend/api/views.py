# api/views.py

from rest_framework import viewsets, permissions, status, generics, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView 
from django.utils import timezone
from django.db.models import Sum, Count
from django.shortcuts import get_object_or_404
from .models import (
    User, Customer, Plan, Subscription, Invoice, InvoiceItem,
    Transaction, PaymentMethod, SupportTicket, TicketMessage,
    NetworkStatus, SystemSettings, AuditLog
)
from .serializers import (
    UserSerializer, CustomerSerializer, PlanSerializer, SubscriptionSerializer,
    InvoiceSerializer, InvoiceItemSerializer, TransactionSerializer,
    PaymentMethodSerializer, SupportTicketSerializer, TicketMessageSerializer,
    NetworkStatusSerializer, SystemSettingsSerializer, AuditLogSerializer
)

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'superadmin'

class IsAdminOrSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'superadmin']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'email', 'date_joined', 'last_login']
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAdminOrSuperAdmin]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsSuperAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        user = serializer.save()
        # Create audit log
        AuditLog.objects.create(
            user=self.request.user,
            action='create',
            resource_type='user',
            resource_id=str(user.id),
            details={'username': user.username},
            ip_address=self.request.META.get('REMOTE_ADDR', '')
        )
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone_number']
    ordering_fields = ['first_name', 'last_name', 'created_at']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminOrSuperAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    @action(detail=True, methods=['get'])
    def invoices(self, request, pk=None):
        customer = self.get_object()
        invoices = Invoice.objects.filter(customer=customer)
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def transactions(self, request, pk=None):
        customer = self.get_object()
        transactions = Transaction.objects.filter(customer=customer)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            permission_classes = [IsAdminOrSuperAdmin]
        elif self.action == 'destroy':
            permission_classes = [IsSuperAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['customer__first_name', 'customer__last_name', 'plan__name']
    ordering_fields = ['start_date', 'end_date', 'created_at']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminOrSuperAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['customer__first_name', 'customer__last_name', 'status']
    ordering_fields = ['issue_date', 'due_date', 'amount']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminOrSuperAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['customer__first_name', 'customer__last_name', 'type', 'status']
    ordering_fields = ['date', 'amount']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminOrSuperAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class PaymentMethodViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentMethodSerializer
    
    def get_queryset(self):
        if self.request.user.role in ['admin', 'superadmin']:
            return PaymentMethod.objects.all()
        customer = Customer.objects.filter(user=self.request.user).first()
        if customer:
            return PaymentMethod.objects.filter(customer=customer)
        return PaymentMethod.objects.none()

class SupportTicketViewSet(viewsets.ModelViewSet):
    queryset = SupportTicket.objects.all()
    serializer_class = SupportTicketSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['ticket_id', 'subject', 'customer__first_name', 'customer__last_name']
    ordering_fields = ['created_at', 'priority', 'status']
    
    def get_queryset(self):
        if self.request.user.role in ['admin', 'superadmin']:
            return SupportTicket.objects.all()
        customer = Customer.objects.filter(user=self.request.user).first()
        if customer:
            return SupportTicket.objects.filter(customer=customer)
        return SupportTicket.objects.none()
    
    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        ticket = self.get_object()
        serializer = TicketMessageSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(ticket=ticket)
            # Update ticket
            ticket.updated_at = timezone.now()
            ticket.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NetworkStatusViewSet(viewsets.ModelViewSet):
    queryset = NetworkStatus.objects.all()
    serializer_class = NetworkStatusSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminOrSuperAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

class SystemSettingsViewSet(viewsets.ModelViewSet):
    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer
    permission_classes = [IsSuperAdmin]
    
    def perform_create(self, serializer):
        serializer.save(updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminOrSuperAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__username', 'action', 'resource_type']
    ordering_fields = ['timestamp', 'action', 'resource_type', 'severity']

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def admin(self, request):
        """Admin dashboard data"""
        if request.user.role not in ['admin', 'superadmin']:
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        # Get statistics
        total_revenue = Transaction.objects.filter(type='payment', status='completed').aggregate(total=Sum('amount'))
        active_plans = Subscription.objects.filter(status='active').count()
        
        # User growth - last 6 months
        now = timezone.now()
        months = []
        user_counts = []
        
        for i in range(5, -1, -1):
            month_start = (now - timezone.timedelta(days=30*i)).replace(day=1, hour=0, minute=0, second=0)
            month_name = month_start.strftime('%b')
            months.append(month_name)
            
            count = User.objects.filter(date_joined__month=month_start.month, date_joined__year=month_start.year).count()
            user_counts.append(count)
        
        # Revenue by region (mocked - you would need to add region to your models)
        revenue_by_region = {
            'labels': ['North', 'South', 'East', 'West', 'Central'],
            'data': [85600, 63400, 42000, 31800, 26163]
        }
        
        # System health (mocked - would be from monitoring system)
        system_health = {
            'cpuLoad': 42,
            'memoryUsage': 68,
            'diskSpace': 78
        }
        
        return Response({
            'stats': {
                'totalRevenue': total_revenue.get('total') or 0,
                'revenueGrowth': 16.2,  # Mocked
                'activePlans': active_plans,
                'retentionRate': 92,  # Mocked
                'serverStatus': 99.99,  # Mocked
                'securityAlerts': 2,  # Mocked
                'systemHealth': system_health,
                'userGrowth': {
                    'labels': months,
                    'data': user_counts
                },
                'revenueByRegion': revenue_by_region
            }
        })
    
    @action(detail=True, methods=['get'])
    def user(self, request, pk=None):
        """User dashboard data"""
        # Make sure users can only view their own data unless admin
        if request.user.role not in ['admin', 'superadmin'] and str(request.user.id) != pk:
            return Response({"detail": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        # Get customer
        customer = get_object_or_404(Customer, user_id=pk)
        
        # Get active subscription
        active_subscription = Subscription.objects.filter(
            customer=customer, 
            status='active', 
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        ).first()
        
        if not active_subscription:
            return Response({
                'stats': {
                    'currentPlan': None,
                    'internetSpeed': 0,
                    'activeDevices': 0,
                    'nextBill': None,
                    'recentActivity': []
                }
            })
        
        # Plan details
        plan = active_subscription.plan
        
        # Mock some usage data (in real app, this would come from usage tracking)
        data_used = 5.2  # GB
        calls_used = 45  # minutes
        sms_used = 25    # count
        
        # Recent activity (mocked)
        recent_activity = [
            {
                'type': 'dataUsage',
                'description': f"{int(data_used / plan.data_limit * 100)}% of data quota used",
                'timestamp': timezone.now() - timezone.timedelta(days=5)
            },
            {
                'type': 'payment',
                'description': "Monthly plan renewed",
                'timestamp': timezone.now() - timezone.timedelta(days=14)
            }
        ]
        
        # Get latest invoice
        next_invoice = Invoice.objects.filter(
            customer=customer,
            status='unpaid',
            due_date__gte=timezone.now()
        ).order_by('due_date').first()
        
        return Response({
            'stats': {
                'currentPlan': {
                    'name': plan.name,
                    'endDate': active_subscription.end_date.strftime('%Y-%m-%d'),
                    'data': {
                        'used': data_used,
                        'total': plan.data_limit
                    },
                    'calls': {
                        'used': calls_used,
                        'total': plan.call_minutes
                    },
                    'sms': {
                        'used': sms_used,
                        'total': plan.sms_count
                    }
                },
                'internetSpeed': plan.speed,
                'activeDevices': 3,  # Mocked
                'nextBill': {
                    'amount': next_invoice.amount if next_invoice else plan.price,
                    'dueDate': next_invoice.due_date.strftime('%Y-%m-%d') if next_invoice else active_subscription.end_date.strftime('%Y-%m-%d')
                },
                'recentActivity': recent_activity
            }
        })