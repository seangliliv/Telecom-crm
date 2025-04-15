# api/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, Customer, Plan, Subscription, Invoice, InvoiceItem,
    Transaction, PaymentMethod, SupportTicket, TicketMessage,
    NetworkStatus, SystemSettings, AuditLog
)

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'status')
    list_filter = ('role', 'status', 'is_active')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'phone_number', 'profile_image', 'status', 'last_active')}),
    )

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'phone_number', 'status')
    list_filter = ('status',)
    search_fields = ('first_name', 'last_name', 'email', 'phone_number')

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'billing_cycle', 'status')
    list_filter = ('billing_cycle', 'status')
    search_fields = ('name', 'description')

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'plan', 'status', 'start_date', 'end_date', 'auto_renew')
    list_filter = ('status', 'auto_renew')
    search_fields = ('customer__first_name', 'customer__last_name', 'plan__name')

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 1

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'amount', 'status', 'issue_date', 'due_date', 'paid_date')
    list_filter = ('status',)
    search_fields = ('customer__first_name', 'customer__last_name')
    inlines = [InvoiceItemInline]

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'amount', 'type', 'status', 'date')
    list_filter = ('type', 'status')
    search_fields = ('customer__first_name', 'customer__last_name')

@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'type', 'last_four', 'is_default')
    list_filter = ('type', 'is_default')
    search_fields = ('customer__first_name', 'customer__last_name')

class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 1

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_id', 'customer', 'subject', 'status', 'priority', 'category', 'assigned_to')
    list_filter = ('status', 'priority', 'category')
    search_fields = ('ticket_id', 'subject', 'customer__first_name', 'customer__last_name')
    inlines = [TicketMessageInline]

@admin.register(NetworkStatus)
class NetworkStatusAdmin(admin.ModelAdmin):
    list_display = ('id', 'service_type', 'status', 'region', 'last_updated')
    list_filter = ('service_type', 'status', 'region')
    search_fields = ('service_type', 'region')

@admin.register(SystemSettings)
class SystemSettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'category', 'updated_by', 'updated_at')
    list_filter = ('category',)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'action', 'resource_type', 'resource_id', 'severity', 'timestamp')
    list_filter = ('action', 'resource_type', 'severity')
    search_fields = ('user__username', 'resource_id')
    readonly_fields = ('user', 'action', 'resource_type', 'resource_id', 'details', 'ip_address', 'severity', 'timestamp')