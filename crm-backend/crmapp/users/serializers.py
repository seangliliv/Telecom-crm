from rest_framework import serializers
from bson import ObjectId

class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    firstName = serializers.CharField(required=True)
    lastName = serializers.CharField(required=True)
    role = serializers.ChoiceField(choices=["superAdmin", "admin", "user"])
    phoneNumber = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    profile_image = serializers.URLField(required=False, allow_blank=True, allow_null=True)
    status = serializers.ChoiceField(choices=["active", "inactive"])
    planId = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    lastActive = serializers.DateTimeField(required=False, allow_null=True)
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)
