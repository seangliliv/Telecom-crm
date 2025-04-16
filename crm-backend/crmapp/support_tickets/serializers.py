# support_tickets/serializers.py
from rest_framework import serializers

class TicketMessageSerializer(serializers.Serializer):
    sender = serializers.ChoiceField(choices=["customer", "support"])
    senderId = serializers.CharField(required=True)
    message = serializers.CharField(required=True)
    timestamp = serializers.DateTimeField(read_only=True)

class SupportTicketSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    ticketId = serializers.CharField(read_only=True)  # Auto-generated
    customerId = serializers.CharField(required=True)
    subject = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    status = serializers.ChoiceField(choices=["open", "in_progress", "resolved", "closed"])
    priority = serializers.ChoiceField(choices=["low", "medium", "high", "critical"])
    category = serializers.CharField(required=True)
    assignedTo = serializers.CharField(required=False, allow_null=True)
    messages = TicketMessageSerializer(many=True, required=False)
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)
    resolvedAt = serializers.DateTimeField(required=False, allow_null=True)