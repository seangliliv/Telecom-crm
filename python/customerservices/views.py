from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import customerservices_collection
from .serializers import CustomerServiceSerializer
from customers.mongo_client import customers_collection
from customers.serializers import CustomerSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
class CustomerServiceListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        services = list(customerservices_collection.find())
        for s in services:
            s['id'] = str(s['_id'])
            del s['_id']
        serializer = CustomerServiceSerializer(services, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomerServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomerServiceDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            service = customerservices_collection.find_one({'_id': ObjectId(pk)})
            if service:
                service['id'] = str(service['_id'])
                del service['_id']
            return service
        except:
            return None

    def get(self, request, pk):
        service = self.get_object(pk)
        if not service:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerServiceSerializer(service)
        return Response(serializer.data)

    def put(self, request, pk):
        service = self.get_object(pk)
        if not service:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerServiceSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        service = self.get_object(pk)
        if not service:
            return Response(status=status.HTTP_404_NOT_FOUND)
        customerservices_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)

class CustomerServiceCustomerView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request, pk):
        service = customerservices_collection.find_one({'_id': ObjectId(pk)})
        if not service:
            return Response(status=status.HTTP_404_NOT_FOUND)
        customer = customers_collection.find_one({'_id': ObjectId(service['customerId'])})
        if customer:
            customer['id'] = str(customer['_id'])
            del customer['_id']
        serializer = CustomerSerializer(customer) if customer else None
        return Response(serializer.data if serializer else None)