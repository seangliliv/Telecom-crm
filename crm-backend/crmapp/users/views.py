from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import UserModel
from .serializers import UserSerializer
from database.monogdb import user_collection
from rest_framework import status
from bson import ObjectId

@api_view(['POST'])
@permission_classes([AllowAny])  # No authentication required for user creation
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data

        if user_collection.find_one({"email": data['email']}):
            return Response({"error": "User already exists"}, status=400)
        
        user = UserModel(data) # Create a new user instance
        result = user_collection.insert_one(user.to_dict()) # Insert the user into the database

        new_user = user.to_dict()
        new_user['_id'] = str(result.inserted_id)
        new_user.pop("password")
        
        return Response({"data": new_user}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])  # No authentication required for user creation
def get_all_users(request):
    users = user_collection.find()
    user_list = []
    for user in users:
        user['_id'] = str(user['_id'])
        user.pop("password", None)
        user_list.append(user)
    return Response({"data": user_list}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_user(request, user_id):
    try:
        user = user_collection.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        return Response({"error": "Invalid user ID format"}, status=status.HTTP_400_BAD_REQUEST)

    if user:
        user['_id'] = str(user['_id'])
        user.pop("password")
        return Response({"data": user}, status=status.HTTP_200_OK)
    return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_user(request, user_id):
    uid = ObjectId(user_id)
    try:
       user = user_collection.find_one({"_id": uid})
    except Exception as e:
        return Response({"error": "Invalid user ID format"}, status=status.HTTP_400_BAD_REQUEST)

    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        data = serializer.validated_data
        user_collection.update_one({"_id": uid}, {"$set": data})
        updated_user = user_collection.find_one({"_id": uid})
        updated_user['_id'] = str(updated_user['_id'])
        updated_user.pop("password")
        return Response({"data": updated_user}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = user_collection.find_one({"_id": ObjectId(user_id)})
    except Exception as e:
        return Response({"error": "Invalid user ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    user_collection.delete_one({"_id": ObjectId(user_id)})

    return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK) 
    



