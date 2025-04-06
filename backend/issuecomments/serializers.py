# serializers.py

from rest_framework import serializers
from issuecomments.mongo_client import issuecomments_collection

class IssueCommentSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    issueId = serializers.CharField(required=True)
    text = serializers.CharField(required=True)
    userId = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(required=False)
    updated_at = serializers.DateTimeField(required=False)

    def create(self, validated_data):
        result = issuecomments_collection.insert_one(validated_data)
        validated_data["_id"] = result.inserted_id
        return validated_data

    def update(self, instance, validated_data):
        issuecomments_collection.update_one(
            {"_id": instance["_id"]}, 
            {"$set": validated_data}
        )
        instance.update(validated_data)
        return instance
