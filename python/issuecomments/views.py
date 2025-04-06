from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import issuecomments_collection
from .serializers import IssueCommentSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
import logging

logger = logging.getLogger(__name__)

class IssueCommentListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]

    def get(self, request):
        logger.info(f"GET request received, user: {request.user}")

        # Ensure that 'id' is correctly retrieved from the user model
        user_id = getattr(request.user, "id", None)
        if not user_id:
            logger.warning("User has no valid ID or is not authenticated")
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Query MongoDB for comments by user_id
        comments = list(issuecomments_collection.find({"userId": str(user_id)}))
        for comment in comments:
            comment["id"] = str(comment["_id"])
            del comment["_id"]
        
        serializer = IssueCommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        logger.info(f"POST request received, user: {request.user}")

        # Ensure user is authenticated
        user_id = getattr(request.user, "id", None)
        if not user_id:
            logger.warning("User not authenticated")
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Prepare the data to be saved
        data = request.data.copy()
        data["userId"] = str(user_id)

        serializer = IssueCommentSerializer(data=data)
        if serializer.is_valid():
            logger.info("Serializer is valid, saving data")
            serializer.save()
            return Response(
                {"message": "Comment created", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )

        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

class IssueCommentDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]

    def get_object(self, pk, request):
        try:
            # Validate ObjectId format
            if not ObjectId.is_valid(pk):
                logger.error(f"Invalid ObjectId format: {pk}")
                return None

            # Ensure that the user is authenticated
            user_id = getattr(request.user, "id", None)
            if not user_id:
                logger.warning("User is not authenticated")
                return None

            # Query MongoDB for the comment
            comment = issuecomments_collection.find_one({'_id': ObjectId(pk), 'userId': str(user_id)})
            if comment:
                comment["id"] = str(comment["_id"])
                del comment["_id"]
            else:
                logger.info(f"No comment found for pk: {pk}, user: {request.user}")
            return comment
        except Exception as e:
            logger.error(f"Error retrieving comment: {e}")
            return None

    def get(self, request, pk):
        logger.info(f"GET request received, user: {request.user}, pk: {pk}")

        # Ensure user is authenticated
        user_id = getattr(request.user, "id", None)
        if not user_id:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the comment object from MongoDB
        comment = self.get_object(pk, request)
        if not comment:
            return Response({"error": "Comment not found or not authorized"}, status=status.HTTP_404_NOT_FOUND)

        # Serialize and return the comment data
        serializer = IssueCommentSerializer(comment)
        return Response(serializer.data)

    def put(self, request, pk):
        logger.info(f"PUT request received, user: {request.user}, pk: {pk}")

        # Ensure user is authenticated
        user_id = getattr(request.user, "id", None)
        if not user_id:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the comment object from MongoDB
        comment = self.get_object(pk, request)
        if not comment:
            return Response({"error": "Comment not found or not authorized"}, status=status.HTTP_404_NOT_FOUND)

        # Update the comment data with new information
        serializer = IssueCommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            logger.info("Serializer is valid, updating data")
            serializer.save()
            return Response(
                {"message": "Comment updated", "data": serializer.data},
                status=status.HTTP_200_OK
            )

        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        logger.info(f"DELETE request received, user: {request.user}, pk: {pk}")

        # Ensure user is authenticated
        user_id = getattr(request.user, "id", None)
        if not user_id:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        # Fetch the comment object and ensure it's authorized to delete
        comment = self.get_object(pk, request)
        if not comment:
            return Response({"error": "Comment not found or not authorized"}, status=status.HTTP_404_NOT_FOUND)

        # Delete the comment from MongoDB
        issuecomments_collection.delete_one({"_id": ObjectId(pk)})
        return Response({"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)
