from rest_framework import serializers
from .mongo_client import categories_collection  # Import categories_collection

class CategorySerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.ChoiceField(choices=['1 Month', '3 Months', 'Yearly'])
    description = serializers.CharField(required=False)

    def create(self, validated_data):
        result = categories_collection.insert_one(validated_data)  # Use imported collection
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        from bson.objectid import ObjectId
        categories_collection.update_one({'_id': ObjectId(instance['id'])}, {'$set': validated_data})
        return {**instance, **validated_data}
