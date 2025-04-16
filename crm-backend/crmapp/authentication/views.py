from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from database.monogdb import user_collection
from utils.password_hash import verify_password
from types import SimpleNamespace

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    user = user_collection.find_one({"email": email})
    print(user)
    if not user or not verify_password(password, user['password']):
        return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

    # Generate JWT token
    refresh = RefreshToken()
    refresh['user_id'] = str(user['_id']) 
    access_token = str(refresh.access_token)

    # Prepare user data for response
    user_data = {
        'user_id': str(user['_id']),
        'email': user['email'],
        "firstName": user['firstName'],
        "lastName": user['lastName'],
        "role": user['role'],
    }

    return Response({
        "refresh": str(refresh),              
        "access": access_token,
        "user": user_data}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    token = request.META.get('HTTP_AUTHORIZATION')
    return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)

