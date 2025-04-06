from rest_framework import serializers
from .mongo_client import roles_collection
from bson.objectid import ObjectId
import datetime

class RoleSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    roleName = serializers.CharField(max_length=100)
    permissions = serializers.ListField(child=serializers.CharField(), required=False)

    def validate_roleName(self, value):
        """Ensure the roleName is unique."""
        if roles_collection.find_one({"roleName": value}):
            raise serializers.ValidationError("Role name already exists.")
        return value

    def create(self, validated_data):
        # Automatically set a 'createdAt' field if not provided
        if 'createdAt' not in validated_data:
            validated_data['createdAt'] = datetime.datetime.utcnow()

        result = roles_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        # Automatically set an 'updatedAt' field if not provided
        validated_data['updatedAt'] = datetime.datetime.utcnow()
        
        roles_collection.update_one({'_id': ObjectId(instance['id'])}, {'$set': validated_data})
        return {**instance, **validated_data}
