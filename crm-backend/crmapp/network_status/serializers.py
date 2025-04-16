# network_status/serializers.py
from rest_framework import serializers

class NetworkStatusSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    serviceType = serializers.CharField(required=True)
    status = serializers.ChoiceField(choices=["operational", "degraded", "outage"])
    region = serializers.CharField(required=True)
    lastUpdated = serializers.DateTimeField(read_only=True)
    details = serializers.CharField(required=False, allow_blank=True)
    affectedUsers = serializers.IntegerField(required=False, default=0)
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)