# audit_logs/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime

from .models import AuditLogModel
from .serializers import AuditLogSerializer
from database.monogdb import audit_log_collection


@api_view(["GET"])
@permission_classes([AllowAny])
def list_audit_logs(request):
    page = int(request.GET.get("page", 1))
    limit = int(request.GET.get("limit", 10))
    resourceType = request.GET.get("resourceType")
    severity = request.GET.get("severity")
    
    query = {}
    if resourceType:
        query["resourceType"] = resourceType
    if severity:
        query["severity"] = severity
    
    logs = list(audit_log_collection.find(query).sort("timestamp", -1))
    for log in logs:
        log["id"] = str(log["_id"])
        del log["_id"]
        
        # Convert ObjectIds to strings
        log["userId"] = str(log["userId"])
        log["resourceId"] = str(log["resourceId"])
    
    # Handle pagination (simplified for now)
    total = len(logs)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paged_logs = logs[start_idx:end_idx]
    
    return Response({
        "logs": paged_logs,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit  # Ceiling division
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_audit_log(request):
    serializer = AuditLogSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Convert string IDs to ObjectIds
        try:
            data["userId"] = ObjectId(data["userId"])
            data["resourceId"] = ObjectId(data["resourceId"])
        except:
            return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
        audit_log = AuditLogModel(data)
        result = audit_log_collection.insert_one(audit_log.to_dict())
        
        # We don't need to return the created log in detail
        return Response({
            "message": "Audit log created successfully",
            "id": str(result.inserted_id)
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)