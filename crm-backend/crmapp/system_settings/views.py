# system_settings/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime

from .models import SystemSettingsModel
from .serializers import SystemSettingsSerializer
from database.monogdb import system_settings_collection


@api_view(["GET"])
@permission_classes([AllowAny])
def get_system_settings(request, category=None):
    query = {}
    if category:
        query["category"] = category
    
    settings = list(system_settings_collection.find(query))
    for s in settings:
        s["id"] = str(s["_id"])
        del s["_id"]
        s["updatedBy"] = str(s["updatedBy"])
    
    return Response({"settings": settings}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def update_system_settings(request):
    serializer = SystemSettingsSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Convert updatedBy to ObjectId
        try:
            data["updatedBy"] = ObjectId(data["updatedBy"])
        except:
            return Response({"error": "Invalid updatedBy ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if settings for this category already exist
        existing = system_settings_collection.find_one({"category": data["category"]})
        
        if existing:
            # Update existing settings
            update_data = {
                "settings": data["settings"],
                "updatedBy": data["updatedBy"],
                "updatedAt": datetime.utcnow()
            }
            system_settings_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": update_data}
            )
            
            # Get updated settings
            updated = system_settings_collection.find_one({"_id": existing["_id"]})
            updated["id"] = str(updated["_id"])
            del updated["_id"]
            updated["updatedBy"] = str(updated["updatedBy"])
            
            return Response({
                "message": "System settings updated successfully",
                "settings": updated
            }, status=status.HTTP_200_OK)
        else:
            # Create new settings
            settings = SystemSettingsModel(data)
            result = system_settings_collection.insert_one(settings.to_dict())
            
            new_settings = settings.to_dict()
            new_settings["_id"] = str(result.inserted_id)
            new_settings["updatedBy"] = str(new_settings["updatedBy"])
            
            return Response({
                "message": "System settings created successfully",
                "settings": new_settings
            }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
