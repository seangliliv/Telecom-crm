from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import categories_collection
from .serializers import CategorySerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
class CategoryListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        categories = list(categories_collection.find())
        for c in categories:
            c['id'] = str(c['_id'])
            del c['_id']
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            category = categories_collection.find_one({'_id': ObjectId(pk)})
            if category:
                category['id'] = str(category['_id'])
                del category['_id']
            return category
        except:
            return None

    def get(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object(pk)
        if not category:
            return Response(status=status.HTTP_404_NOT_FOUND)
        categories_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)