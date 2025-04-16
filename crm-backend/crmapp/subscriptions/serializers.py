from rest_framework import serializers
from bson import ObjectId


class SubscriptionSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.CharField(required=True)
    planId = serializers.CharField(required=True)
    status = serializers.ChoiceField(choices=["active", "pending", "canceled", "expired"])
    startDate = serializers.DateTimeField(required=True)
    endDate = serializers.DateTimeField(required=True)
    autoRenew = serializers.BooleanField(required=True)
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)
