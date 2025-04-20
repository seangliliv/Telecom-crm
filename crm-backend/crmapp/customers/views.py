from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import CustomerModel
from .serializers import CustomerSerializer
from bson import ObjectId
from django.core.paginator import Paginator
from database.monogdb import customer_collection
import datetime

def parse_objectid(id_str):
    if not isinstance(id_str, str):
        return None
    try:
        return ObjectId(id_str)
    except Exception:
        return None


@api_view(["GET"])
@permission_classes([AllowAny])
def list_customers(request):
    page = int(request.GET.get("page", 1))
    limit = int(request.GET.get("limit", 10))
    status_filter = request.GET.get("status")
    search = request.GET.get("search", "")

    query = {}

    if status_filter:
        query["status"] = status_filter
    if search:
        query["$or"] = [
            {"firstName": {"$regex": search, "$options": "i"}},
            {"lastName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]

    customers = list(customer_collection.find(query).sort("createdAt", -1))
    for c in customers:
        c["id"] = str(c["_id"])
        del c['_id']

        if c.get("currentPlan") and c["currentPlan"].get("planId"):
            c["currentPlan"]["planId"] = str(c["currentPlan"]["planId"])
            
        if c.get("userId"):
            c["userId"] = str(c["userId"])

    paginator = Paginator(customers, limit)
    paged = paginator.get_page(page)

    return Response({
        "total": paginator.count,
        "page": page,
        "pages": paginator.num_pages,
        "results": paged.object_list
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_customer(request, customer_id):
    _id = parse_objectid(customer_id)
    if not _id:
        return Response({"error": "Invalid ID"}, status=400)

    customer = customer_collection.find_one({"_id": _id})
    if not customer:
        return Response({"error": "Customer not found"}, status=404)

    customer["id"] = str(customer["_id"])
    del customer['_id']
    
    if customer.get("currentPlan") and customer["currentPlan"].get("planId"):
        customer["currentPlan"]["planId"] = str(customer["currentPlan"]["planId"])
        
    if customer.get("userId"):
        customer["userId"] = str(customer["userId"])

    return Response({"data": customer}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_customer(request):
    serializer = CustomerSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        if customer_collection.find_one({"email": data["email"]}):
            return Response({"error": "Email already exists"}, status=400)
            
        # Convert userId to ObjectId if present
        if data.get("userId"):
            try:
                data["userId"] = ObjectId(data["userId"])
            except:
                return Response({"error": "Invalid userId format"}, status=400)

        customer = CustomerModel(data)
        result = customer_collection.insert_one(customer.to_dict())

        new_customer = customer.to_dict()
        new_customer['id'] = str(result.inserted_id)
        
        if new_customer.get("userId"):
            new_customer["userId"] = str(new_customer["userId"])
            
        if new_customer.get("currentPlan") and new_customer["currentPlan"].get("planId"):
            new_customer["currentPlan"]["planId"] = str(new_customer["currentPlan"]["planId"])

        return Response({"data": new_customer}, status=201)
    return Response(serializer.errors, status=400)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_customers_by_user(request, user_id):
    _id = parse_objectid(user_id)
    if not _id:
        return Response({"error": "Invalid user ID"}, status=400)

    customers = list(customer_collection.find({"userId": _id}).sort("createdAt", -1))
    for c in customers:
        c["id"] = str(c["_id"])
        del c['_id']

        if c.get("currentPlan") and c["currentPlan"].get("planId"):
            c["currentPlan"]["planId"] = str(c["currentPlan"]["planId"])
            
        if c.get("userId"):
            c["userId"] = str(c["userId"])

    return Response({"data": customers}, status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([AllowAny])
def update_customer(request, customer_id):
    _id = parse_objectid(customer_id)
    if not _id:
        return Response({"error": "Invalid ID"}, status=400)

    customer = customer_collection.find_one({"_id": _id})
    if not customer:
        return Response({"error": "Customer not found"}, status=404)

    serializer = CustomerSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Convert userId to ObjectId if present
        if data.get("userId"):
            try:
                data["userId"] = ObjectId(data["userId"])
            except:
                return Response({"error": "Invalid userId format"}, status=400)
                
        updated_data = CustomerModel(data).to_dict()
        updated_data["updatedAt"] = datetime.datetime.now()
        customer_collection.update_one({"_id": _id}, {"$set": updated_data})
        
        # Convert ObjectId to string for response
        if updated_data.get("userId"):
            updated_data["userId"] = str(updated_data["userId"])
            
        if updated_data.get("currentPlan") and updated_data["currentPlan"].get("planId"):
            updated_data["currentPlan"]["planId"] = str(updated_data["currentPlan"]["planId"])
            
        return Response({
            "message": "Customer updated",
            "data": updated_data
            }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_customer(request, customer_id):
    _id = parse_objectid(customer_id)
    if not _id:
        return Response({"error": "Invalid ID"}, status=400)

    result = customer_collection.delete_one({"_id": _id})
    if result.deleted_count == 0:
        return Response({"error": "Customer not found"}, status=404)

    return Response({"message": "Customer deleted"})