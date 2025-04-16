from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime

from .models import SubscriptionModel
from .serializers import SubscriptionSerializer
from database.monogdb import subscription_collection


@api_view(["GET"])
@permission_classes([AllowAny])
def list_subscriptions(request):
    subscriptions = list(subscription_collection.find().sort("createdAt", -1))
    for s in subscriptions:
        s["id"] = str(s["_id"])
        del s['_id']
    
        # convert other ObjectId
        if s.get("customerId"):
            s["customerId"] = str(s['customerId'])
        if s.get("planId"):
            s['planId'] = str(s['planId'])
    
    return Response({"data": subscriptions}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_subscription(request, subscription_id):
    try:
        _id = ObjectId(subscription_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    sub = subscription_collection.find_one({"_id": _id})
    if not sub:
        return Response({"error": "Subscription not found"}, status=404)

    sub["id"] = str(sub["_id"])
    del sub["_id"]
    return Response({"data": sub}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_subscription(request):
    serializer = SubscriptionSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        sub = SubscriptionModel(data)
        result = subscription_collection.insert_one(sub.to_dict())

        new_sub = sub.to_dict()
        new_sub["_id"] = str(result.inserted_id)

        return Response({"data": new_sub}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=400)


@api_view(["PUT"])
@permission_classes([AllowAny])
def update_subscription(request, subscription_id):
    try:
        _id = ObjectId(subscription_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    existing = subscription_collection.find_one({"_id": _id})
    if not existing:
        return Response({"error": "Subscription not found"}, status=404)

    serializer = SubscriptionSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        updated = SubscriptionModel(data).to_dict()
        updated["updatedAt"] = datetime.utcnow()
        subscription_collection.update_one({"_id": _id}, {"$set": updated})
        return Response({"message": "Subscription updated", "data": updated}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_subscription(request, subscription_id):
    try:
        _id = ObjectId(subscription_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    result = subscription_collection.delete_one({"_id": _id})
    if result.deleted_count == 0:
        return Response({"error": "Subscription not found"}, status=404)

    return Response({"message": "Subscription deleted"})
