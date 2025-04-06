from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import users_collection
from .serializers import UserSerializer
from roles.mongo_client import roles_collection
from roles.serializers import RoleSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
class UserListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        users = list(users_collection.find())
        for u in users:
            u['id'] = str(u['_id'])
            del u['_id']
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            user = users_collection.find_one({'_id': ObjectId(pk)})
            if user:
                user['id'] = str(user['_id'])
                del user['_id']
            return user
        except:
            return None

    def get(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        users_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserRolesView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request, pk):
        user = users_collection.find_one({'_id': ObjectId(pk)})
        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)
        role = roles_collection.find_one({'_id': ObjectId(user['roleId'])})
        if role:
            role['id'] = str(role['_id'])
            del role['_id']
        serializer = RoleSerializer(role) if role else None
        return Response(serializer.data if serializer else None)