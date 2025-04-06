import logging
from rest_framework.permissions import BasePermission

logger = logging.getLogger(__name__)

class IsAuthenticatedCustom(BasePermission):
    def has_permission(self, request, view):
        # Check if the user is authenticated using DRF's standard method
        result = request.user.is_authenticated
        logger.info(f"Checking permission for user: {request.user}, type: {type(request.user)}, authenticated: {result}")
        return result

    def has_object_permission(self, request, view, obj):
        logger.info(f"Checking object permission for user: {request.user}, obj: {obj}")
        return True  # Allow all for now