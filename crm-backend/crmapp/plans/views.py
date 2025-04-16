from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime

from .models import PlanModel
from .serializers import PlanSerializer
from database.monogdb import plan_collection


@api_view(["GET"])
@permission_classes([AllowAny])
def list_plans(request):
    plans = list(plan_collection.find().sort("createdAt", -1))
    for p in plans:
        p["id"] = str(p["_id"])
        del p["_id"]
    return Response({"data": plans}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_plan(request, plan_id):
    try:
        _id = ObjectId(plan_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    plan = plan_collection.find_one({"_id": _id})
    if not plan:
        return Response({"error": "Plan not found"}, status=404)

    plan["id"] = str(plan["_id"])
    del plan["_id"]
    return Response({'data': plan}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_plan(request):
    serializer = PlanSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        plan = PlanModel(data)
        result = plan_collection.insert_one(plan.to_dict())

        new_plans = plan.to_dict() 
        new_plans['_id'] = str(result.inserted_id)

        return Response({"data": new_plans}, status=201)
    return Response(serializer.errors, status=400)


@api_view(["PUT"])
@permission_classes([AllowAny])
def update_plan(request, plan_id):
    try:
        _id = ObjectId(plan_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    existing = plan_collection.find_one({"_id": _id})
    if not existing:
        return Response({"error": "Plan not found"}, status=404)

    serializer = PlanSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        updated = PlanModel(data).to_dict()
        updated["updatedAt"] = datetime.utcnow()
        plan_collection.update_one({"_id": _id}, {"$set": updated})
        return Response({"message": "Plan updated",
                          "data": updated
                         })
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_plan(request, plan_id):
    try:
        _id = ObjectId(plan_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    result = plan_collection.delete_one({"_id": _id})
    if result.deleted_count == 0:
        return Response({"error": "Plan not found"}, status=404)

    return Response({"message": "Plan deleted"})
