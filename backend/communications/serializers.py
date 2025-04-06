from rest_framework import serializers
from .mongo_client import communications_collection, customers_collection, users_collection
from bson.objectid import ObjectId
import datetime

class CommunicationSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.CharField(max_length=24)
    userId = serializers.CharField(max_length=24)
    type = serializers.ChoiceField(choices=['Email', 'Chat'])
    subject = serializers.CharField(max_length=100)
    message = serializers.CharField()
    dateTime = serializers.DateTimeField(read_only=True)
    status = serializers.ChoiceField(choices=['Sent', 'Read', 'Replied'], default='Sent')

    def validate_customerId(self, value):
        # Ensure valid ObjectId format
        if not ObjectId.is_valid(value):
            raise serializers.ValidationError("Invalid customerId format.")
        
        # Check if the customerId exists in the customers collection
        customer = customers_collection.find_one({"_id": ObjectId(value)})
        if not customer:
            raise serializers.ValidationError(f"Customer with id {value} does not exist.")
        return value

    def validate_userId(self, value):
        # Ensure valid ObjectId format
        if not ObjectId.is_valid(value):
            raise serializers.ValidationError("Invalid userId format.")
        
        # Check if the userId exists in the users collection
        user = users_collection.find_one({"_id": ObjectId(value)})
        if not user:
            raise serializers.ValidationError(f"User with id {value} does not exist.")
        return value

    def create(self, validated_data):
        validated_data['dateTime'] = datetime.datetime.utcnow()
        result = communications_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        updated_data = {**instance, **validated_data}
        updated_data['dateTime'] = datetime.datetime.utcnow()
        communications_collection.update_one({'_id': ObjectId(instance['id'])}, {'$set': updated_data})
        return updated_data
