from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import communications_collection
from .serializers import CommunicationSerializer
from customers.mongo_client import customers_collection
from customers.serializers import CustomerSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
class CommunicationListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        communications = list(communications_collection.find())
        for c in communications:
            c['id'] = str(c['_id'])
            del c['_id']
        serializer = CommunicationSerializer(communications, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CommunicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommunicationDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            comm = communications_collection.find_one({'_id': ObjectId(pk)})
            if comm:
                comm['id'] = str(comm['_id'])
                del comm['_id']
            return comm
        except:
            return None

    def get(self, request, pk):
        comm = self.get_object(pk)
        if not comm:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CommunicationSerializer(comm)
        return Response(serializer.data)

    def put(self, request, pk):
        comm = self.get_object(pk)
        if not comm:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CommunicationSerializer(comm, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comm = self.get_object(pk)
        if not comm:
            return Response(status=status.HTTP_404_NOT_FOUND)
        communications_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)

class CommunicationCustomerView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request, pk):
        comm = communications_collection.find_one({'_id': ObjectId(pk)})
        if not comm:
            return Response(status=status.HTTP_404_NOT_FOUND)
        customer = customers_collection.find_one({'_id': ObjectId(comm['customerId'])})
        if customer:
            customer['id'] = str(customer['_id'])
            del customer['_id']
        serializer = CustomerSerializer(customer) if customer else None
        return Response(serializer.data if serializer else None)