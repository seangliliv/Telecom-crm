from rest_framework import serializers

class InvoiceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    subscriptionId = serializers.CharField(max_length=24)
    customerId = serializers.CharField(max_length=24)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    status = serializers.ChoiceField(choices=['Paid', 'Pending', 'Overdue'], default='Pending')
    issueDate = serializers.DateTimeField()
    dueDate = serializers.DateTimeField()

    def create(self, validated_data):
        from .mongo_client import invoices_collection

        # Convert Decimal to float
        validated_data['amount'] = float(validated_data['amount'])

        # Convert datetime fields to string
        validated_data['issueDate'] = validated_data['issueDate'].isoformat()
        validated_data['dueDate'] = validated_data['dueDate'].isoformat()

        result = invoices_collection.insert_one(validated_data)
        validated_data['id'] = str(result.inserted_id)
        return validated_data

    def update(self, instance, validated_data):
        from .mongo_client import invoices_collection
        from bson.objectid import ObjectId

        # Convert Decimal to float
        if 'amount' in validated_data:
            validated_data['amount'] = float(validated_data['amount'])

        # Convert datetime fields to string
        if 'issueDate' in validated_data:
            validated_data['issueDate'] = validated_data['issueDate'].isoformat()
        if 'dueDate' in validated_data:
            validated_data['dueDate'] = validated_data['dueDate'].isoformat()

        invoices_collection.update_one(
            {'_id': ObjectId(instance['id'])},
            {'$set': validated_data}
        )
        return {**instance, **validated_data}
