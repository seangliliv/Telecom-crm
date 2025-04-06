from rest_framework import serializers
import datetime
from .mongo_client import issues_collection  # Ensure this import is added

class IssueSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.CharField(max_length=24)
    subject = serializers.CharField(max_length=100)
    description = serializers.CharField(required=False)
    priority = serializers.ChoiceField(choices=['High', 'Medium', 'Low'])
    status = serializers.ChoiceField(choices=['Open', 'Pending', 'Resolved', 'Closed'], default='Open')
    createdDate = serializers.DateTimeField(read_only=True)
    resolvedDate = serializers.DateTimeField(required=False)
    assignedTo = serializers.CharField(max_length=24, required=False)
    category = serializers.CharField(max_length=100, required=False)

    def create(self, validated_data):
        validated_data['createdDate'] = datetime.datetime.utcnow().isoformat()

        # Insert the new issue into the MongoDB collection
        result = issues_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        from bson.objectid import ObjectId

        if validated_data.get('status') == 'Resolved' and not instance.get('resolvedDate'):
            validated_data['resolvedDate'] = datetime.datetime.utcnow().isoformat()

        issues_collection.update_one({'_id': ObjectId(instance['id'])}, {'$set': validated_data})
        return {**instance, **validated_data}
