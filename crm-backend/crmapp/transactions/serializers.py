from rest_framework import serializers

class PaymentMethodDetailsSerializer(serializers.Serializer):
    type = serializers.CharField(required=True)  # "credit_card", "bank_transfer", etc.
    lastFour = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    cardType = serializers.CharField(required=False, allow_blank=True, allow_null=True)

class TransactionSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.CharField(required=True)
    invoiceId = serializers.CharField(required=False, allow_null=True)
    amount = serializers.FloatField(required=True)
    type = serializers.ChoiceField(choices=["payment", "refund", "topup"])
    status = serializers.ChoiceField(choices=["completed", "pending", "failed", "reversed"])
    paymentMethod = PaymentMethodDetailsSerializer(required=False)
    date = serializers.DateTimeField(required=True)
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)