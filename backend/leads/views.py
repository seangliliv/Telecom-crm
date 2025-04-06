from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import leads_collection
from .serializers import LeadSerializer
from campaigns.mongo_client import campaigns_collection
from campaigns.serializers import CampaignSerializer
from bson.objectid import ObjectId
from crm.permissions import IsAuthenticatedCustom
class LeadListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        leads = list(leads_collection.find())
        for l in leads:
            l['id'] = str(l['_id'])
            del l['_id']
        serializer = LeadSerializer(leads, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = LeadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LeadDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            lead = leads_collection.find_one({'_id': ObjectId(pk)})
            if lead:
                lead['id'] = str(lead['_id'])
                del lead['_id']
            return lead
        except:
            return None

    def get(self, request, pk):
        lead = self.get_object(pk)
        if not lead:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = LeadSerializer(lead)
        return Response(serializer.data)

    def put(self, request, pk):
        lead = self.get_object(pk)
        if not lead:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = LeadSerializer(lead, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        lead = self.get_object(pk)
        if not lead:
            return Response(status=status.HTTP_404_NOT_FOUND)
        leads_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)

class LeadCampaignView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request, pk):
        lead = leads_collection.find_one({'_id': ObjectId(pk)})
        if not lead:
            return Response(status=status.HTTP_404_NOT_FOUND)
        campaign = campaigns_collection.find_one({'_id': ObjectId(lead['campaignId'])})
        if campaign:
            campaign['id'] = str(campaign['_id'])
            del campaign['_id']
        serializer = CampaignSerializer(campaign) if campaign else None
        return Response(serializer.data if serializer else None)