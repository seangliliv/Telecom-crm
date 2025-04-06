from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from crm.permissions import IsAuthenticatedCustom
from .mongo_client import services_collection
from .serializers import ServiceSerializer
from bson.objectid import ObjectId

class ServiceListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]

    def get(self, request):
        services = list(services_collection.find())
        for s in services:
            s['id'] = str(s['_id'])
            del s['_id']
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ServiceDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]

    def get_object(self, pk):
        try:
            service = services_collection.find_one({'_id': ObjectId(pk)})
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
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    def put(self, request, pk):
        service = self.get_object(pk)
        if not service:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ServiceSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        service = self.get_object(pk)
        if not service:
            return Response(status=status.HTTP_404_NOT_FOUND)
        services_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)