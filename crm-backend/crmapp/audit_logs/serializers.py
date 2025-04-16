# audit_logs/serializers.py
from rest_framework import serializers

class AuditLogSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    userId = serializers.CharField(required=True)
    action = serializers.CharField(required=True)
    resourceType = serializers.CharField(required=True)
    resourceId = serializers.CharField(required=True)
    details = serializers.DictField(required=False)
    ipAddress = serializers.IPAddressField(required=True)
    severity = serializers.ChoiceField(choices=["normal", "high", "critical"])
    timestamp = serializers.DateTimeField(read_only=True)