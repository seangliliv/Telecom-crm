from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime

from .models import InvoiceModel
from .serializers import InvoiceSerializer
from database.monogdb import invoice_collection


@api_view(["GET"])
@permission_classes([AllowAny])
def list_invoices(request):
    invoices = list(invoice_collection.find().sort("createdAt", -1))
    for invoice in invoices:
        invoice["id"] = str(invoice["_id"])
        del invoice['_id']

        if invoice.get('customerId'):
            invoice['customerId'] = str(invoice['customerId'])
        if invoice.get('subscriptionId'):
            invoice['subscriptionId'] = str(invoice['subscriptionId'])

    return Response({"data": invoices}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_invoice(request, invoice_id):
    try:
        _id = ObjectId(invoice_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    invoice = invoice_collection.find_one({"_id": _id})
    if not invoice:
        return Response({"error": "Invoice not found"}, status=404)

    invoice["id"] = str(invoice["_id"])
    del invoice['_id']

    if invoice.get('customerId'):
        invoice['customerId'] = str(invoice['customerId'])
    if invoice.get('subscriptionId'):
        invoice['subscriptionId'] = str(invoice['subscriptionId'])
        
    return Response({"data": invoice}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_invoice(request):
    serializer = InvoiceSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        invoice = InvoiceModel(data)
        result = invoice_collection.insert_one(invoice.to_dict())

        new_invoice = invoice.to_dict()
        new_invoice["_id"] = str(result.inserted_id)

        return Response({"data": new_invoice}, status=201)
    return Response(serializer.errors, status=400)


@api_view(["PUT"])
@permission_classes([AllowAny])
def update_invoice(request, invoice_id):
    try:
        _id = ObjectId(invoice_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    existing = invoice_collection.find_one({"_id": _id})
    if not existing:
        return Response({"error": "Invoice not found"}, status=404)

    serializer = InvoiceSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        updated = InvoiceModel(data).to_dict()
        updated["updatedAt"] = datetime.utcnow()
        invoice_collection.update_one({"_id": _id}, {"$set": updated})
        return Response({"message": "Invoice updated", "data": updated}, status=200)
    return Response(serializer.errors, status=400)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_invoice(request, invoice_id):
    try:
        _id = ObjectId(invoice_id)
    except:
        return Response({"error": "Invalid ID"}, status=400)

    result = invoice_collection.delete_one({"_id": _id})
    if result.deleted_count == 0:
        return Response({"error": "Invoice not found"}, status=404)

    return Response({"message": "Invoice deleted"})
