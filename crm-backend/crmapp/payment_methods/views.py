# payment_methods/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId

from .models import PaymentMethodModel
from .serializers import PaymentMethodSerializer
from database.monogdb import payment_method_collection


@api_view(["GET"])
@permission_classes([AllowAny])
def list_payment_methods(request, customer_id):
    try:
        customer_oid = ObjectId(customer_id)
    except:
        return Response({"error": "Invalid customer ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    payment_methods = list(payment_method_collection.find({"customerId": customer_oid}))
    for pm in payment_methods:
        pm["id"] = str(pm["_id"])
        del pm["_id"]
        pm["customerId"] = str(pm["customerId"])
    
    return Response({"payment_methods": payment_methods}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_payment_method(request):
    serializer = PaymentMethodSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        # If setting as default, unset other defaults for this customer
        if data.get("isDefault"):
            try:
                customer_oid = ObjectId(data["customerId"])
                payment_method_collection.update_many(
                    {"customerId": customer_oid, "isDefault": True},
                    {"$set": {"isDefault": False}}
                )
            except:
                return Response({"error": "Invalid customer ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Convert string ID to ObjectId
        try:
            data["customerId"] = ObjectId(data["customerId"])
        except:
            return Response({"error": "Invalid customer ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
        payment_method = PaymentMethodModel(data)
        result = payment_method_collection.insert_one(payment_method.to_dict())
        
        new_payment_method = payment_method.to_dict()
        new_payment_method["_id"] = str(result.inserted_id)
        new_payment_method["customerId"] = str(new_payment_method["customerId"])
        
        return Response({
            "message": "Payment method added successfully",
            "payment_method": new_payment_method
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_payment_method(request, payment_method_id):
    try:
        pm_oid = ObjectId(payment_method_id)
    except:
        return Response({"error": "Invalid payment method ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    result = payment_method_collection.delete_one({"_id": pm_oid})
    if result.deleted_count == 0:
        return Response({"error": "Payment method not found"}, status=status.HTTP_404_NOT_FOUND)
    
    return Response({"message": "Payment method deleted successfully"}, status=status.HTTP_200_OK)