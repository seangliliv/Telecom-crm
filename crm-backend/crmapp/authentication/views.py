from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from database.monogdb import user_collection
from utils.password_hash import verify_password
from types import SimpleNamespace
from bson import ObjectId

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

    # Check if user has associated customers
    from database.monogdb import customer_collection
    customers = list(customer_collection.find({"userId": ObjectId(user['_id'])}))
    customer_ids = [str(customer['_id']) for customer in customers]

    # Prepare user data for response
    user_data = {
        'id': str(user['_id']),  # Changed from user_id to id for frontend consistency
        'userId': str(user['_id']),  # Include both formats for compatibility
        'email': user['email'],
        "firstName": user['firstName'],
        "lastName": user['lastName'],
        "role": user['role'],
        "customerIds": customer_ids,  # Include associated customer IDs if any
        "hasCustomer": len(customer_ids) > 0  # Flag indicating if user has customer account
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


@api_view(['GET'])
@permission_classes([AllowAny])
def check_auth(request):
    """
    Simple endpoint to check if the user is authenticated
    and return current user information
    """
    if not request.user.is_authenticated:
        return Response({"authenticated": False}, status=status.HTTP_401_UNAUTHORIZED)
    
    # If using JWT, you can extract user_id from the token
    user_id = request.user.id
    
    # Look up the user in MongoDB
    user = user_collection.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user has associated customers
    from database.monogdb import customer_collection
    customers = list(customer_collection.find({"userId": ObjectId(user['_id'])}))
    customer_ids = [str(customer['_id']) for customer in customers]
    
    user_data = {
        'id': str(user['_id']),
        'userId': str(user['_id']),
        'email': user['email'],
        "firstName": user['firstName'],
        "lastName": user['lastName'],
        "role": user['role'],
        "customerIds": customer_ids,
        "hasCustomer": len(customer_ids) > 0
    }
    
    return Response({
        "authenticated": True,
        "user": user_data
    }, status=status.HTTP_200_OK)