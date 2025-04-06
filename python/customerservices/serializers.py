from rest_framework import serializers
from .mongo_client import customerservices_collection
import datetime
from bson.objectid import ObjectId

class CustomerServiceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.CharField(max_length=24)
    serviceId = serializers.CharField(max_length=24)
    activationDate = serializers.DateTimeField()
    status = serializers.ChoiceField(choices=['Active', 'Suspended', 'Terminated'], default='Active')

    def create(self, validated_data):
        # Ensure activationDate is in UTC
        validated_data['activationDate'] = datetime.datetime.utcnow()
        # Insert the validated data into MongoDB collection
        result = customerservices_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        # Convert activationDate to UTC if provided in the update
        if 'activationDate' in validated_data:
            validated_data['activationDate'] = datetime.datetime.utcnow()
        
        # Update the existing record in MongoDB
        customerservices_collection.update_one(
            {'_id': ObjectId(instance['id'])}, 
            {'$set': validated_data}
        )
        return {**instance, **validated_data}
