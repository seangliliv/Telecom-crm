from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import campaigns_collection
from .serializers import CampaignSerializer
from leads.mongo_client import leads_collection
from leads.serializers import LeadSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
class CampaignListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        campaigns = list(campaigns_collection.find())
        for c in campaigns:
            c['id'] = str(c['_id'])
            del c['_id']
        serializer = CampaignSerializer(campaigns, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CampaignSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CampaignDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            campaign = campaigns_collection.find_one({'_id': ObjectId(pk)})
            if campaign:
                campaign['id'] = str(campaign['_id'])
                del campaign['_id']
            return campaign
        except:
            return None

    def get(self, request, pk):
        campaign = self.get_object(pk)
        if not campaign:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CampaignSerializer(campaign)
        return Response(serializer.data)

    def put(self, request, pk):
        campaign = self.get_object(pk)
        if not campaign:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CampaignSerializer(campaign, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        campaign = self.get_object(pk)
        if not campaign:
            return Response(status=status.HTTP_404_NOT_FOUND)
        campaigns_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)

class CampaignStartView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def post(self, request, pk):
        campaign = CampaignDetailView().get_object(pk)
        if not campaign:
            return Response(status=status.HTTP_404_NOT_FOUND)
        campaign['status'] = 'Active'
        campaigns_collection.update_one({'_id': ObjectId(pk)}, {'$set': {'status': 'Active'}})
        return Response({'status': 'Campaign started'}, status=status.HTTP_200_OK)