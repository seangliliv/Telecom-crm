from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import subscriptions_collection
from .serializers import SubscriptionSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
class SubscriptionListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        subscriptions = list(subscriptions_collection.find())
        for sub in subscriptions:
            sub['id'] = str(sub['_id'])
            del sub['_id']
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SubscriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubscriptionDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            sub = subscriptions_collection.find_one({'_id': ObjectId(pk)})
            if sub:
                sub['id'] = str(sub['_id'])
                del sub['_id']
            return sub
        except:
            return None

    def get(self, request, pk):
        sub = self.get_object(pk)
        if not sub:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SubscriptionSerializer(sub)
        return Response(serializer.data)

    def put(self, request, pk):
        sub = self.get_object(pk)
        if not sub:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SubscriptionSerializer(sub, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        sub = self.get_object(pk)
        if not sub:
            return Response(status=status.HTTP_404_NOT_FOUND)
        subscriptions_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)