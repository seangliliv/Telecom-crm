from rest_framework import serializers
from .mongo_client import users_collection
from bson import ObjectId

class UserSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)  # This will hold the user id
    firstName = serializers.CharField(max_length=100)
    lastName = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    roleId = serializers.CharField(max_length=24)
    status = serializers.ChoiceField(choices=['Active', 'Inactive'], default='Active')
    lastActive = serializers.DateTimeField(required=False)
    profileImage = serializers.CharField(required=False)

    def create(self, validated_data):
        result = users_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)  # Make sure it's converting ObjectId to string
        return validated_data

    def update(self, instance, validated_data):
        from bson.objectid import ObjectId
        users_collection.update_one({'_id': ObjectId(instance['id'])}, {'$set': validated_data})
        return {**instance, **validated_data}

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # MongoDB ObjectId handling: convert _id to id string
        representation['id'] = str(instance['_id'])  # Adjusting to handle MongoDB's _id field
        return representation
