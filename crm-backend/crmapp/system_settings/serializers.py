# system_settings/serializers.py
from rest_framework import serializers

class SystemSettingsSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    category = serializers.ChoiceField(choices=["general", "email", "security", "backup"])
    settings = serializers.DictField(required=True)
    updatedBy = serializers.CharField(required=True)
    createdAt = serializers.DateTimeField(read_only=True)
    updatedAt = serializers.DateTimeField(read_only=True)