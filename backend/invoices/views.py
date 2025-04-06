from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import invoices_collection
from .serializers import InvoiceSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
class InvoiceListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        invoices = list(invoices_collection.find())
        for i in invoices:
            i['id'] = str(i['_id'])
            del i['_id']
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = InvoiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InvoiceDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            invoice = invoices_collection.find_one({'_id': ObjectId(pk)})
            if invoice:
                invoice['id'] = str(invoice['_id'])
                del invoice['_id']
            return invoice
        except:
            return None

    def get(self, request, pk):
        invoice = self.get_object(pk)
        if not invoice:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = InvoiceSerializer(invoice)
        return Response(serializer.data)

    def put(self, request, pk):
        invoice = self.get_object(pk)
        if not invoice:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = InvoiceSerializer(invoice, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        invoice = self.get_object(pk)
        if not invoice:
            return Response(status=status.HTTP_404_NOT_FOUND)
        invoices_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)

class InvoiceProcessView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def post(self, request, pk):
        invoice = InvoiceDetailView().get_object(pk)
        if not invoice:
            return Response(status=status.HTTP_404_NOT_FOUND)
        invoice['status'] = 'Paid'
        invoices_collection.update_one({'_id': ObjectId(pk)}, {'$set': {'status': 'Paid'}})
        return Response({'status': 'Invoice processed'}, status=status.HTTP_200_OK)