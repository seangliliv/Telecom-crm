# network_status/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime

from .models import NetworkStatusModel
from .serializers import NetworkStatusSerializer
from database.monogdb import network_status_collection


@api_view(["GET"])
@permission_classes([AllowAny])
def get_network_status(request):
    statuses = list(network_status_collection.find().sort("lastUpdated", -1))
    for s in statuses:
        s["id"] = str(s["_id"])
        del s["_id"]
    
    return Response({"status": statuses}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_network_status(request):
    serializer = NetworkStatusSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        network_status = NetworkStatusModel(data)
        result = network_status_collection.insert_one(network_status.to_dict())
        
        new_status = network_status.to_dict()
        new_status["_id"] = str(result.inserted_id)
        
        return Response({
            "message": "Network status created successfully",
            "status": {
                "_id": new_status["_id"],
                "serviceType": new_status["serviceType"],
                "status": new_status["status"],
                "region": new_status["region"]
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([AllowAny])
def update_network_status(request, status_id):
    try:
        _id = ObjectId(status_id)
    except:
        return Response({"error": "Invalid status ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    status_obj = network_status_collection.find_one({"_id": _id})
    if not status_obj:
        return Response({"error": "Network status not found"}, status=status.HTTP_404_NOT_FOUND)
    
    data = request.data
    update_data = {}
    
    if "status" in data:
        update_data["status"] = data["status"]
    
    if "details" in data:
        update_data["details"] = data["details"]
    
    if "affectedUsers" in data:
        update_data["affectedUsers"] = data["affectedUsers"]
    
    if update_data:
        update_data["lastUpdated"] = datetime.utcnow()
        update_data["updatedAt"] = datetime.utcnow()
        network_status_collection.update_one({"_id": _id}, {"$set": update_data})
    
    # Get updated status
    updated_status = network_status_collection.find_one({"_id": _id})
    updated_status["id"] = str(updated_status["_id"])
    del updated_status["_id"]
    
    return Response({
        "message": "Network status updated successfully",
        "status": updated_status
    }, status=status.HTTP_200_OK)
