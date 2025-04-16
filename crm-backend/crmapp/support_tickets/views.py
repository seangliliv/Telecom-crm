# support_tickets/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime

from .models import SupportTicketModel, TicketMessageModel
from .serializers import SupportTicketSerializer, TicketMessageSerializer
from database.monogdb import ticket_collection


@api_view(["GET"])
@permission_classes([AllowAny])
def list_tickets(request):
    page = int(request.GET.get("page", 1))
    limit = int(request.GET.get("limit", 10))
    status_filter = request.GET.get("status")
    priority_filter = request.GET.get("priority")
    
    query = {}
    if status_filter:
        query["status"] = status_filter
    if priority_filter:
        query["priority"] = priority_filter
    
    tickets = list(ticket_collection.find(query).sort("createdAt", -1))
    for t in tickets:
        t["id"] = str(t["_id"])
        del t["_id"]
        
        # Convert ObjectIds to strings
        t["customerId"] = str(t["customerId"])
        if t.get("assignedTo"):
            t["assignedTo"] = str(t["assignedTo"])
    
    # Handle pagination (simplified for now)
    total = len(tickets)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paged_tickets = tickets[start_idx:end_idx]
    
    return Response({
        "tickets": paged_tickets,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit  # Ceiling division
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_ticket(request, ticket_id):
    try:
        _id = ObjectId(ticket_id)
    except:
        return Response({"error": "Invalid ticket ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    ticket = ticket_collection.find_one({"_id": _id})
    if not ticket:
        return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)
    
    ticket["id"] = str(ticket["_id"])
    del ticket["_id"]
    
    # Convert ObjectIds to strings
    ticket["customerId"] = str(ticket["customerId"])
    if ticket.get("assignedTo"):
        ticket["assignedTo"] = str(ticket["assignedTo"])
    
    # Convert senderId in messages to strings
    for msg in ticket.get("messages", []):
        if msg.get("senderId"):
            msg["senderId"] = str(msg["senderId"])
    
    return Response({"ticket": ticket}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def create_ticket(request):
    serializer = SupportTicketSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Convert string IDs to ObjectIds
        try:
            data["customerId"] = ObjectId(data["customerId"])
            if data.get("assignedTo"):
                data["assignedTo"] = ObjectId(data["assignedTo"])
        except:
            return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create initial message from the description
        if data.get("description") and data.get("customerId"):
            data["messages"] = [{
                "sender": "customer",
                "senderId": data["customerId"],
                "message": data["description"],
                "timestamp": datetime.utcnow()
            }]
        
        ticket = SupportTicketModel(data)
        result = ticket_collection.insert_one(ticket.to_dict())
        
        new_ticket = ticket.to_dict()
        new_ticket["_id"] = str(result.inserted_id)
        new_ticket["customerId"] = str(new_ticket["customerId"])
        if new_ticket.get("assignedTo"):
            new_ticket["assignedTo"] = str(new_ticket["assignedTo"])
        
        # Convert senderId in messages to strings
        for msg in new_ticket.get("messages", []):
            if msg.get("senderId"):
                msg["senderId"] = str(msg["senderId"])
        
        return Response({
            "message": "Ticket created successfully",
            "ticket": {
                "_id": new_ticket["_id"],
                "ticketId": new_ticket["ticketId"],
                "subject": new_ticket["subject"],
                "status": new_ticket["status"]
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([AllowAny])
def update_ticket(request, ticket_id):
    try:
        _id = ObjectId(ticket_id)
    except:
        return Response({"error": "Invalid ticket ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    ticket = ticket_collection.find_one({"_id": _id})
    if not ticket:
        return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # For partial updates
    data = request.data
    update_data = {}
    
    # Update allowed fields
    if "status" in data:
        update_data["status"] = data["status"]
        # If status is being set to resolved, set resolvedAt
        if data["status"] == "resolved" and ticket.get("status") != "resolved":
            update_data["resolvedAt"] = datetime.utcnow()
    
    if "priority" in data:
        update_data["priority"] = data["priority"]
    
    if "assignedTo" in data:
        try:
            update_data["assignedTo"] = ObjectId(data["assignedTo"])
        except:
            return Response({"error": "Invalid assignedTo ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    if "category" in data:
        update_data["category"] = data["category"]
    
    if update_data:
        update_data["updatedAt"] = datetime.utcnow()
        ticket_collection.update_one({"_id": _id}, {"$set": update_data})
    
    # Get the updated ticket
    updated_ticket = ticket_collection.find_one({"_id": _id})
    updated_ticket["id"] = str(updated_ticket["_id"])
    del updated_ticket["_id"]
    
    # Convert ObjectIds to strings
    updated_ticket["customerId"] = str(updated_ticket["customerId"])
    if updated_ticket.get("assignedTo"):
        updated_ticket["assignedTo"] = str(updated_ticket["assignedTo"])
    
    return Response({
        "message": "Ticket updated successfully",
        "ticket": updated_ticket
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def add_ticket_message(request, ticket_id):
    try:
        _id = ObjectId(ticket_id)
    except:
        return Response({"error": "Invalid ticket ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    ticket = ticket_collection.find_one({"_id": _id})
    if not ticket:
        return Response({"error": "Ticket not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TicketMessageSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Convert senderId to ObjectId
        try:
            data["senderId"] = ObjectId(data["senderId"])
        except:
            return Response({"error": "Invalid senderId format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create the message
        message = TicketMessageModel(data).to_dict()
        
        # Add to ticket messages array
        ticket_collection.update_one(
            {"_id": _id},
            {
                "$push": {"messages": message},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        # Convert senderId back to string for response
        message["senderId"] = str(message["senderId"])
        
        return Response({
            "message": "Message added successfully",
            "ticketMessage": message
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)