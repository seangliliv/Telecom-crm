# api/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class User(AbstractUser):
    ROLE_CHOICES = (
        ('superadmin', 'Super Admin'),
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    status = models.CharField(max_length=20, default='active', choices=[('active', 'Active'), ('inactive', 'Inactive')])
    last_active = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.username

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address_street = models.CharField(max_length=255, null=True, blank=True)
    address_city = models.CharField(max_length=100, null=True, blank=True)
    address_state = models.CharField(max_length=100, null=True, blank=True)
    address_postal_code = models.CharField(max_length=20, null=True, blank=True)
    address_country = models.CharField(max_length=100, null=True, blank=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    status = models.CharField(max_length=20, default='active', 
                             choices=[('active', 'Active'), ('suspended', 'Suspended'), ('terminated', 'Terminated')])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Plan(models.Model):
    BILLING_CYCLE_CHOICES = (
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('deprecated', 'Deprecated'),
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLE_CHOICES)
    data_limit = models.PositiveIntegerField(help_text='Data limit in GB')
    call_minutes = models.PositiveIntegerField(help_text='Call minutes')
    sms_count = models.PositiveIntegerField(help_text='SMS count')
    speed = models.PositiveIntegerField(help_text='Speed in Mbps')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Subscription(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('pending', 'Pending'),
        ('canceled', 'Canceled'),
        ('expired', 'Expired'),
    )
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name='subscriptions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    auto_renew = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.customer} - {self.plan}"

class Invoice(models.Model):
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('unpaid', 'Unpaid'),
        ('overdue', 'Overdue'),
        ('canceled', 'Canceled'),
    )
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')
    subscription = models.ForeignKey(Subscription, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    issue_date = models.DateTimeField()
    due_date = models.DateTimeField()
    paid_date = models.DateTimeField(null=True, blank=True)
    payment_method = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Invoice {self.id} - {self.customer}"

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.description} - {self.amount}"

class Transaction(models.Model):
    TYPE_CHOICES = (
        ('payment', 'Payment'),
        ('refund', 'Refund'),
        ('topup', 'Top Up'),
    )
    
    STATUS_CHOICES = (
        ('completed', 'Completed'),
        ('pending', 'Pending'),
        ('failed', 'Failed'),
        ('reversed', 'Reversed'),
    )
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='transactions')
    invoice = models.ForeignKey(Invoice, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    payment_method_type = models.CharField(max_length=50, null=True, blank=True)
    payment_method_last_four = models.CharField(max_length=4, null=True, blank=True)
    payment_method_card_type = models.CharField(max_length=20, null=True, blank=True)
    date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.type} - {self.amount}"

class PaymentMethod(models.Model):
    TYPE_CHOICES = (
        ('credit_card', 'Credit Card'),
        ('bank_account', 'Bank Account'),
    )
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='payment_methods')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    card_type = models.CharField(max_length=20, null=True, blank=True)
    last_four = models.CharField(max_length=4)
    expiry_date = models.CharField(max_length=5, null=True, blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.type} - {self.last_four}"

class SupportTicket(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )
    
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    CATEGORY_CHOICES = (
        ('billing', 'Billing'),
        ('technical', 'Technical'),
        ('account', 'Account'),
        ('other', 'Other'),
    )
    
    ticket_id = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='support_tickets')
    subject = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.ticket_id:
            year = timezone.now().year
            count = SupportTicket.objects.filter(created_at__year=year).count() + 1
            self.ticket_id = f"TK-{year}{count:04d}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.ticket_id} - {self.subject}"

class TicketMessage(models.Model):
    SENDER_CHOICES = (
        ('customer', 'Customer'),
        ('support', 'Support'),
    )
    
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES)
    sender_id = models.CharField(max_length=100)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message {self.id} for {self.ticket.ticket_id}"

class NetworkStatus(models.Model):
    STATUS_CHOICES = (
        ('operational', 'Operational'),
        ('degraded', 'Degraded'),
        ('outage', 'Outage'),
    )
    
    service_type = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='operational')
    region = models.CharField(max_length=100)
    last_updated = models.DateTimeField(auto_now=True)
    details = models.TextField(null=True, blank=True)
    affected_users = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.service_type} - {self.status}"

class SystemSettings(models.Model):
    CATEGORY_CHOICES = (
        ('general', 'General'),
        ('email', 'Email'),
        ('security', 'Security'),
        ('backup', 'Backup'),
    )
    
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    settings = models.JSONField()
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='updated_settings')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.category} Settings"

class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
    )
    
    RESOURCE_CHOICES = (
        ('user', 'User'),
        ('customer', 'Customer'),
        ('plan', 'Plan'),
        ('subscription', 'Subscription'),
        ('invoice', 'Invoice'),
        ('transaction', 'Transaction'),
        ('ticket', 'Support Ticket'),
        ('network', 'Network Status'),
        ('settings', 'System Settings'),
    )
    
    SEVERITY_CHOICES = (
        ('normal', 'Normal'),
        ('high', 'High'),
        ('critical', 'Critical'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audit_logs')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    resource_type = models.CharField(max_length=20, choices=RESOURCE_CHOICES)
    resource_id = models.CharField(max_length=100)
    details = models.JSONField(null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES, default='normal')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.action} {self.resource_type} by {self.user}"