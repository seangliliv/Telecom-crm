from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import customers_collection
from .serializers import CustomerSerializer
from bson.objectid import ObjectId

class CustomerListCreateView(APIView):
    def get(self, request):
        customers = list(customers_collection.find())
        for customer in customers:
            customer['id'] = str(customer['_id'])
            del customer['_id']
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomerDetailView(APIView):
    def get_object(self, pk):
        try:
            customer = customers_collection.find_one({'_id': ObjectId(pk)})
            if customer:
                customer['id'] = str(customer['_id'])
                del customer['_id']
            return customer
        except:
            return None

    def get(self, request, pk):
        customer = self.get_object(pk)
        if not customer:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def put(self, request, pk):
        customer = self.get_object(pk)
        if not customer:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        customer = self.get_object(pk)
        if not customer:
            return Response(status=status.HTTP_404_NOT_FOUND)
        customers_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)