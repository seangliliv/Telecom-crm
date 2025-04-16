# support_tickets/models.py
from datetime import datetime
from bson import ObjectId

class TicketMessageModel:
    def __init__(self, data):
        self.sender = data.get("sender")  # "customer" or "support"
        self.senderId = data.get("senderId")
        self.message = data.get("message")
        self.timestamp = data.get("timestamp", datetime.utcnow())

    def to_dict(self):
        return {
            "sender": self.sender,
            "senderId": self.senderId,
            "message": self.message,
            "timestamp": self.timestamp
        }

class SupportTicketModel:
    def __init__(self, data):
        # Generate a ticket ID with format TK-YYYYNNN
        year = datetime.utcnow().strftime("%Y")
        last_ticket = None  # This would need to be queried from the database
        ticket_num = 1  # Default if no tickets exist
        if last_ticket and last_ticket.get("ticketId"):
            # Extract the number from the last ticket ID and increment
            try:
                last_num = int(last_ticket.get("ticketId").split("-")[1][4:])
                ticket_num = last_num + 1
            except:
                pass
        
        self.ticketId = f"TK-{year}{ticket_num:03d}"
        self.customerId = data.get("customerId")
        self.subject = data.get("subject")
        self.description = data.get("description")
        self.status = data.get("status", "open")  # "open", "in_progress", "resolved", "closed"
        self.priority = data.get("priority", "medium")  # "low", "medium", "high", "critical"
        self.category = data.get("category")  # "billing", "technical", "account", etc.
        self.assignedTo = data.get("assignedTo", None)  # Reference to admin/support user
        self.messages = []
        if data.get("messages"):
            for msg_data in data.get("messages"):
                self.messages.append(TicketMessageModel(msg_data).to_dict())
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()
        self.resolvedAt = data.get("resolvedAt", None)

    def to_dict(self):
        return {
            "ticketId": self.ticketId,
            "customerId": self.customerId,
            "subject": self.subject,
            "description": self.description,
            "status": self.status,
            "priority": self.priority,
            "category": self.category,
            "assignedTo": self.assignedTo,
            "messages": self.messages,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
            "resolvedAt": self.resolvedAt
        }