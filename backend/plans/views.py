from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import plans_collection
from .serializers import PlanSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom

import logging

logger = logging.getLogger(__name__)

class PlanListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]

    def get(self, request):
        logger.info(f"GET request received, user: {request.user}")
        plans = list(plans_collection.find())
        for plan in plans:
            plan['id'] = str(plan['_id'])
            del plan['_id']
        serializer = PlanSerializer(plans, many=True)
        return Response(serializer.data)

    def post(self, request):
        logger.info(f"POST request received, user: {request.user}")
        serializer = PlanSerializer(data=request.data)
        if serializer.is_valid():
            logger.info("Serializer is valid, saving data")
            serializer.save()
            return Response(
                {"message": "Plan created", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        logger.info(f"Serializer errors: {serializer.errors}")
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

class PlanDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]

    def get_object(self, pk):
        try:
            if not ObjectId.is_valid(pk):
                logger.error(f"Invalid ObjectId format: {pk}")
                return None
            plan = plans_collection.find_one({'_id': ObjectId(pk)})
            if plan:
                plan['id'] = str(plan['_id'])
                del plan['_id']
            return plan
        except bson.errors.InvalidId:
            logger.error(f"Invalid ObjectId provided: {pk}")
            return None

    def get(self, request, pk):
        logger.info(f"GET detail request received, user: {request.user}, pk: {pk}")
        plan = self.get_object(pk)
        if not plan:
            return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PlanSerializer(plan)
        return Response(serializer.data)

    def put(self, request, pk):
        logger.info(f"PUT request received, user: {request.user}, pk: {pk}")
        plan = self.get_object(pk)
        if not plan:
            return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = PlanSerializer(plan, data=request.data, partial=True)
        if serializer.is_valid():
            logger.info("Serializer is valid, updating data")
            serializer.save()
            return Response(
                {"message": "Plan updated", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        logger.info(f"Serializer errors: {serializer.errors}")
        return Response(
            {"message": "Invalid data", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        logger.info(f"DELETE request received, user: {request.user}, pk: {pk}")
        plan = self.get_object(pk)
        if not plan:
            return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)
        plans_collection.delete_one({'_id': ObjectId(pk)})
        return Response({"message": "Plan deleted"}, status=status.HTTP_204_NO_CONTENT)