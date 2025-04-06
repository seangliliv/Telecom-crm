from rest_framework import serializers
from .mongo_client import campaigns_collection  # Import the collection from mongo_client
import datetime
from bson.objectid import ObjectId  # Import ObjectId for the update operation

class CampaignSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    campaignName = serializers.CharField(max_length=100)
    type = serializers.CharField(max_length=50)
    startDate = serializers.DateTimeField()
    endDate = serializers.DateTimeField(required=False)
    status = serializers.ChoiceField(choices=['Planned', 'Active', 'Completed'], default='Planned')
    targetAudience = serializers.CharField(max_length=100, required=False)

    def create(self, validated_data):
        result = campaigns_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        campaigns_collection.update_one({'_id': ObjectId(instance['id'])}, {'$set': validated_data})
        return {**instance, **validated_data}
