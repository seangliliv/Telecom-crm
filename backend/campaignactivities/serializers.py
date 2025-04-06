from rest_framework import serializers
import datetime

class CampaignActivitySerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    campaignId = serializers.CharField(max_length=24)
    userId = serializers.CharField(max_length=24)
    description = serializers.CharField(max_length=255)
    dateTime = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        validated_data['dateTime'] = datetime.datetime.utcnow()
        result = campaignactivities_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        from bson.objectid import ObjectId
        campaignactivities_collection.update_one(
            {'_id': ObjectId(instance['id'])},
            {'$set': validated_data}
        )
        return {**instance, **validated_data}