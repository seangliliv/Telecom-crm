from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .mongo_client import issues_collection
from .serializers import IssueSerializer
from issuecomments.mongo_client import issuecomments_collection
from issuecomments.serializers import IssueCommentSerializer
from bson.objectid import ObjectId
import datetime
from crm.permissions import IsAuthenticatedCustom
class IssueListCreateView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get(self, request):
        issues = list(issues_collection.find())
        for i in issues:
            i['id'] = str(i['_id'])
            del i['_id']
        serializer = IssueSerializer(issues, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = IssueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class IssueDetailView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def get_object(self, pk):
        try:
            issue = issues_collection.find_one({'_id': ObjectId(pk)})
            if issue:
                issue['id'] = str(issue['_id'])
                del issue['_id']
            return issue
        except:
            return None

    def get(self, request, pk):
        issue = self.get_object(pk)
        if not issue:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = IssueSerializer(issue)
        return Response(serializer.data)

    def put(self, request, pk):
        issue = self.get_object(pk)
        if not issue:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = IssueSerializer(issue, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        issue = self.get_object(pk)
        if not issue:
            return Response(status=status.HTTP_404_NOT_FOUND)
        issues_collection.delete_one({'_id': ObjectId(pk)})
        return Response(status=status.HTTP_204_NO_CONTENT)

class IssueResolveView(APIView):
    permission_classes = [IsAuthenticatedCustom]
    def post(self, request, pk):
        issue = IssueDetailView().get_object(pk)
        if not issue:
            return Response(status=status.HTTP_404_NOT_FOUND)
        issue['status'] = 'Resolved'
        issue['resolvedDate'] = datetime.datetime.utcnow()
        issues_collection.update_one({'_id': ObjectId(pk)}, {'$set': {'status': 'Resolved', 'resolvedDate': issue['resolvedDate']}})
        return Response({'status': 'Issue resolved'}, status=status.HTTP_200_OK)