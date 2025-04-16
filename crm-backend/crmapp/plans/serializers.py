from rest_framework import serializers

class FeatureSerializer(serializers.Serializer):
    data = serializers.IntegerField(required=True)
    calls = serializers.IntegerField(required=True)
    sms = serializers.IntegerField(required=True)
    speed = serializers.IntegerField(required=True)


class PlanSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    price = serializers.FloatField(required=True)
    billingCycle = serializers.ChoiceField(choices=["monthly", "quarterly", "yearly"])
    features = FeatureSerializer(required=True)
    status = serializers.ChoiceField(choices=["active", "inactive", "deprecated"])
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)
