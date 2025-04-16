from rest_framework import serializers


class AddressSerializer(serializers.Serializer):
    street = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    postalCode = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)


class CurrentPlanSerializer(serializers.Serializer):
    planId = serializers.CharField(required=False, allow_null=True)
    startDate = serializers.DateTimeField(required=False, allow_null=True)
    endDate = serializers.DateTimeField(required=False, allow_null=True)
    autoRenew = serializers.BooleanField(required=False, default=False)


class CustomerSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    firstName = serializers.CharField(required=True)
    lastName = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    phoneNumber = serializers.CharField(required=True)
    address = AddressSerializer(required=False)
    currentPlan = CurrentPlanSerializer(required=False)
    balance = serializers.FloatField(default=0.0)
    status = serializers.ChoiceField(choices=["active", "suspended", "terminated"])
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)
