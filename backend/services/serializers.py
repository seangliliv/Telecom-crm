from rest_framework import serializers
from .mongo_client import services_collection  # Import services_collection

class ServiceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    serviceName = serializers.CharField(max_length=100)
    category = serializers.CharField(max_length=100, required=False)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    duration = serializers.CharField(max_length=50)
    status = serializers.ChoiceField(choices=['Active', 'Maintenance'], default='Active')
    subscribers = serializers.IntegerField(default=0)

    def create(self, validated_data):
        # Convert the Decimal to float before insertion
        validated_data['price'] = float(validated_data['price'])
        result = services_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        # Convert the Decimal to float before update
        if 'price' in validated_data:
            validated_data['price'] = float(validated_data['price'])
        from bson.objectid import ObjectId
        services_collection.update_one({'_id': ObjectId(instance['id'])}, {'$set': validated_data})
        return {**instance, **validated_data}
