from rest_framework import serializers

class PlanSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    planName = serializers.CharField(max_length=100)
    billingCycle = serializers.ChoiceField(choices=['Monthly', 'Yearly'])
    categoryId = serializers.CharField(max_length=24, required=False)
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    status = serializers.ChoiceField(choices=['1', '0'], default='1')
    speed = serializers.IntegerField(required=False)  # New field added
    subscribers = serializers.IntegerField(default=0)

    def create(self, validated_data):
        from .mongo_client import plans_collection
        
        # Convert Decimal price to float
        validated_data['price'] = float(validated_data['price'])

        result = plans_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        from .mongo_client import plans_collection
        from bson.objectid import ObjectId
        
        # Convert Decimal price to float
        if 'price' in validated_data:
            validated_data['price'] = float(validated_data['price'])

        plans_collection.update_one(
            {'_id': ObjectId(instance['id'])},
            {'$set': validated_data}
        )
        return {**instance, **validated_data}
