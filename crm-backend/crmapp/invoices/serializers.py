from rest_framework import serializers


class InvoiceItemSerializer(serializers.Serializer):
    description = serializers.CharField()
    amount = serializers.FloatField()


class InvoiceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.CharField(required=True)
    subscriptionId = serializers.CharField(required=True)
    amount = serializers.FloatField(required=True)
    status = serializers.ChoiceField(choices=["paid", "unpaid", "overdue", "canceled"])
    issueDate = serializers.DateTimeField(required=True)
    dueDate = serializers.DateTimeField(required=True)
    paidDate = serializers.DateTimeField(required=False, allow_null=True)
    items = InvoiceItemSerializer(many=True, required=False)
    paymentMethod = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)

