import datetime  # Import datetime module
from .mongo_client import leads_collection  # Import leads_collection
from rest_framework import serializers

class LeadSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.CharField(max_length=24)
    campaignId = serializers.CharField(max_length=24)
    status = serializers.ChoiceField(choices=['New', 'Contacted', 'Converted'], default='New')
    source = serializers.CharField(max_length=100, required=False)
    createdDate = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        validated_data['createdDate'] = datetime.datetime.utcnow()  # Use datetime module
        result = leads_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        from bson.objectid import ObjectId
        leads_collection.update_one({'_id': ObjectId(instance['id'])}, {'$set': validated_data})
        return {**instance, **validated_data}
