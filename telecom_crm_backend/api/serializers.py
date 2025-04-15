# api/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, Customer, Plan, Subscription, Invoice, InvoiceItem,
    Transaction, PaymentMethod, SupportTicket, TicketMessage,
    NetworkStatus, SystemSettings, AuditLog
)

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 
                 'role', 'phone_number', 'profile_image', 'status', 'last_active')
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    plan_details = PlanSerializer(source='plan', read_only=True)
    customer_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Subscription
        fields = '__all__'
    
    def get_customer_name(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ('id', 'description', 'amount')

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True, read_only=True)
    customer_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Invoice
        fields = '__all__'
    
    def get_customer_name(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"

class TransactionSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = '__all__'
    
    def get_customer_name(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'

class TicketMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketMessage
        fields = '__all__'

class SupportTicketSerializer(serializers.ModelSerializer):
    messages = TicketMessageSerializer(many=True, read_only=True)
    customer_name = serializers.SerializerMethodField()
    assigned_to_name = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportTicket
        fields = '__all__'
        read_only_fields = ('ticket_id',)
    
    def get_customer_name(self, obj):
        return f"{obj.customer.first_name} {obj.customer.last_name}"
    
    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return f"{obj.assigned_to.first_name} {obj.assigned_to.last_name}"
        return None

class NetworkStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkStatus
        fields = '__all__'

class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AuditLog
        fields = '__all__'
    
    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"