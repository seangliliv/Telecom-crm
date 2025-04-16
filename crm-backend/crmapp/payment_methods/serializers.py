# payment_methods/serializers.py
from rest_framework import serializers

class PaymentMethodSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.CharField(required=True)
    type = serializers.ChoiceField(choices=["credit_card", "bank_account"])
    cardType = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    lastFour = serializers.CharField(required=True)
    expiryDate = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    isDefault = serializers.BooleanField(default=False)
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)