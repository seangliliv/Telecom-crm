from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import roles_collection
from .serializers import RoleSerializer
from users.mongo_client import users_collection
from users.serializers import UserSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
class RoleListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        roles = list(roles_collection.find())
        for r in roles:
            r['id'] = str(r['_id'])
            del r['_id']
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoleDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            role = roles_collection.find_one({'_id': ObjectId(pk)})
            if role:
                role['id'] = str(role['_id'])
                del role['_id']
            return role
        except:
            return None

    def get(self, request, pk):
        role = self.get_object(pk)
        if not role:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RoleSerializer(role)
        return Response(serializer.data)

    def put(self, request, pk):
        role = self.get_object(pk)
        if not role:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = RoleSerializer(role, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        role = self.get_object(pk)
        if not role:
            return Response(status=status.HTTP_404_NOT_FOUND)
        roles_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)

class RoleUsersView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request, pk):
        if not roles_collection.find_one({'_id': ObjectId(pk)}):
            return Response(status=status.HTTP_404_NOT_FOUND)
        users = list(users_collection.find({'roleId': pk}))
        for u in users:
            u['id'] = str(u['_id'])
            del u['_id']
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)