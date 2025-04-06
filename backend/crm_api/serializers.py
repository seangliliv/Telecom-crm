from rest_framework import serializers

class CustomerSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    firstName = serializers.CharField(max_length=100)
    lastName = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=15, required=False)
    address = serializers.CharField(required=False)
    createdDate = serializers.DateTimeField(read_only=True)
    lastUpdated = serializers.DateTimeField(read_only=True)
    status = serializers.ChoiceField(choices=['Active', 'Inactive', 'Prospect'], default='Prospect')
    profileImage = serializers.CharField(required=False)

    def create(self, validated_data):
        from .mongo_client import customers_collection
        import datetime
        now = datetime.datetime.utcnow()
        validated_data['createdDate'] = now
        validated_data['lastUpdated'] = now
        result = customers_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        from .mongo_client import customers_collection
        from bson.objectid import ObjectId
        validated_data['lastUpdated'] = datetime.datetime.utcnow()
        customers_collection.update_one(
            {'_id': ObjectId(instance['id'])},
            {'$set': validated_data}
        )
        return {**instance, **validated_data}