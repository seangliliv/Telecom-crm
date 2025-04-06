from rest_framework.views import APIView  # Ensure correct import
from rest_framework.response import Response
from rest_framework import status
from crm.permissions import IsAuthenticatedCustom
from .mongo_client import customers_collection
from .serializers import CustomerSerializer
from subscriptions.mongo_client import subscriptions_collection
from subscriptions.serializers import SubscriptionSerializer
from bson.objectid import ObjectId
import logging

logger = logging.getLogger(__name__)

class CustomerListCreateView(APIView):  # Changed from ApiView to APIView
    permission_classes = [IsAuthenticatedCustom]

    def get(self, request):
        logger.info(f"GET request received, user: {request.user}")
        customers = list(customers_collection.find())
        for c in customers:
            c['id'] = str(c['_id'])
            del c['_id']
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request):
        logger.info(f"POST request received, user: {request.user}")
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            logger.info("Serializer is valid, saving data")
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.info(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomerDetailView(APIView):  # Changed from ApiView to APIView
    permission_classes = [IsAuthenticatedCustom]

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
        logger.info(f"GET detail request received, user: {request.user}, pk: {pk}")
        customer = self.get_object(pk)
        if not customer:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def put(self, request, pk):
        logger.info(f"PUT request received, user: {request.user}, pk: {pk}")
        customer = self.get_object(pk)
        if not customer:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        logger.info(f"DELETE request received, user: {request.user}, pk: {pk}")
        customer = self.get_object(pk)
        if not customer:
            return Response(status=status.HTTP_404_NOT_FOUND)
        customers_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)