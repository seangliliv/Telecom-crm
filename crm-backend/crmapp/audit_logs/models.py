# audit_logs/models.py
from datetime import datetime
from bson import ObjectId

class AuditLogModel:
    def __init__(self, data):
        self.userId = data.get("userId")  # User who performed the action
        self.action = data.get("action")  # "create", "update", "delete", "login", etc.
        self.resourceType = data.get("resourceType")  # "user", "customer", "plan", etc.
        self.resourceId = data.get("resourceId")  # ID of the affected resource
        self.details = data.get("details", {})  # Details of the changes
        self.ipAddress = data.get("ipAddress")
        self.severity = data.get("severity", "normal")  # "normal", "high", "critical"
        self.timestamp = data.get("timestamp", datetime.utcnow())

    def to_dict(self):
        return {
            "userId": self.userId,
            "action": self.action,
            "resourceType": self.resourceType,
            "resourceId": self.resourceId,
            "details": self.details,
            "ipAddress": self.ipAddress,
            "severity": self.severity,
            "timestamp": self.timestamp
        }
