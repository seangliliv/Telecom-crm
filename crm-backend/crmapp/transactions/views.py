from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime

from .models import TransactionModel
from .serializers import TransactionSerializer
from database.monogdb import transaction_collection


@api_view(["GET"])
@permission_classes([AllowAny])
def list_transactions(request):
    page = int(request.GET.get("page", 1))
    limit = int(request.GET.get("limit", 10))
    type_filter = request.GET.get("type")
    status_filter = request.GET.get("status")
    
    query = {}
    if type_filter:
        query["type"] = type_filter
    if status_filter:
        query["status"] = status_filter
    
    transactions = list(transaction_collection.find(query).sort("date", -1))
    for t in transactions:
        t["id"] = str(t["_id"])
        del t["_id"]
        
        # Convert ObjectIds to strings
        if t.get("customerId"):
            t["customerId"] = str(t["customerId"])
        if t.get("invoiceId"):
            t["invoiceId"] = str(t["invoiceId"])
    
    # Handle pagination (simplified for now)
    total = len(transactions)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paged_transactions = transactions[start_idx:end_idx]
    
    return Response({
        "transactions": paged_transactions,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit  # Ceiling division
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_customer_transactions(request, customer_id):
    try:
        customer_oid = ObjectId(customer_id)
    except:
        return Response({"error": "Invalid customer ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    transactions = list(transaction_collection.find({"customerId": customer_oid}).sort("date", -1))
    for t in transactions:
        t["id"] = str(t["_id"])
        del t["_id"]
        
        t["customerId"] = str(t["customerId"])
        if t.get("invoiceId"):
            t["invoiceId"] = str(t["invoiceId"])
    
    return Response({"transactions": transactions}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_transaction(request):
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Convert string IDs to ObjectIds
        try:
            data["customerId"] = ObjectId(data["customerId"])
            if data.get("invoiceId"):
                data["invoiceId"] = ObjectId(data["invoiceId"])
        except:
            return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
        transaction = TransactionModel(data)
        result = transaction_collection.insert_one(transaction.to_dict())
        
        new_transaction = transaction.to_dict()
        new_transaction["_id"] = str(result.inserted_id)
        new_transaction["customerId"] = str(new_transaction["customerId"])
        if new_transaction.get("invoiceId"):
            new_transaction["invoiceId"] = str(new_transaction["invoiceId"])
        
        return Response({
            "message": "Transaction created successfully",
            "transaction": new_transaction
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
