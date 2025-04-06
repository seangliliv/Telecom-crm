from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import campaignactivities_collection
from .serializers import CampaignActivitySerializer
from campaigns.mongo_client import campaigns_collection
from campaigns.serializers import CampaignSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom

class CampaignActivityListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        activities = list(campaignactivities_collection.find())
        for activity in activities:
            activity['id'] = str(activity['_id'])
            del activity['_id']
        serializer = CampaignActivitySerializer(activities, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CampaignActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CampaignActivityDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            activity = campaignactivities_collection.find_one({'_id': ObjectId(pk)})
            if activity:
                activity['id'] = str(activity['_id'])
                del activity['_id']
            return activity
        except:
            return None

    def get(self, request, pk):
        activity = self.get_object(pk)
        if not activity:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CampaignActivitySerializer(activity)
        return Response(serializer.data)

    def put(self, request, pk):
        activity = self.get_object(pk)
        if not activity:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CampaignActivitySerializer(activity, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        activity = self.get_object(pk)
        if not activity:
            return Response(status=status.HTTP_404_NOT_FOUND)
        campaignactivities_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)

class CampaignActivityCampaignView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request, pk):
        activity = CampaignActivityDetailView().get_object(pk)
        if not activity:
            return Response(status=status.HTTP_404_NOT_FOUND)
        campaign = campaigns_collection.find_one({'_id': ObjectId(activity['campaignId'])})
        if campaign:
            campaign['id'] = str(campaign['_id'])
            del campaign['_id']
            serializer = CampaignSerializer(campaign)
            return Response(serializer.data)
        return Response(status=status.HTTP_404_NOT_FOUND)