from rest_framework import serializers

class SubscriptionSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    customerId = serializers.CharField(max_length=24)
    planId = serializers.CharField(max_length=24)
    startDate = serializers.DateTimeField()
    endDate = serializers.DateTimeField(required=False)
    billingCycle = serializers.ChoiceField(choices=['Monthly', 'Yearly'])
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    paymentStatus = serializers.ChoiceField(choices=['Paid', 'Pending', 'Overdue'], default='Pending')
    lastPaymentDate = serializers.DateTimeField(required=False)

    def create(self, validated_data):
        from .mongo_client import subscriptions_collection
        import datetime

        # Convert Decimal to float
        validated_data['amount'] = float(validated_data['amount'])

        # Convert datetime fields to string (optional but recommended)
        validated_data['startDate'] = validated_data['startDate'].isoformat()
        if 'endDate' in validated_data:
            validated_data['endDate'] = validated_data['endDate'].isoformat()
        if 'lastPaymentDate' in validated_data:
            validated_data['lastPaymentDate'] = validated_data['lastPaymentDate'].isoformat()

        result = subscriptions_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        from .mongo_client import subscriptions_collection
        from bson.objectid import ObjectId

        # Convert Decimal to float
        if 'amount' in validated_data:
            validated_data['amount'] = float(validated_data['amount'])

        # Convert datetime fields to string
        if 'startDate' in validated_data:
            validated_data['startDate'] = validated_data['startDate'].isoformat()
        if 'endDate' in validated_data:
            validated_data['endDate'] = validated_data['endDate'].isoformat()
        if 'lastPaymentDate' in validated_data:
            validated_data['lastPaymentDate'] = validated_data['lastPaymentDate'].isoformat()

        subscriptions_collection.update_one(
            {'_id': ObjectId(instance['id'])},
            {'$set': validated_data}
        )
        return {**instance, **validated_data}
