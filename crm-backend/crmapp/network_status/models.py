# network_status/models.py
from datetime import datetime

class NetworkStatusModel:
    def __init__(self, data):
        self.serviceType = data.get("serviceType")  # "4G", "Voice", "SMS", etc.
        self.status = data.get("status")  # "operational", "degraded", "outage"
        self.region = data.get("region")  # e.g., "Central District"
        self.lastUpdated = data.get("lastUpdated", datetime.utcnow())
        self.details = data.get("details", "")
        self.affectedUsers = data.get("affectedUsers", 0)
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def to_dict(self):
        return {
            "serviceType": self.serviceType,
            "status": self.status,
            "region": self.region,
            "lastUpdated": self.lastUpdated,
            "details": self.details,
            "affectedUsers": self.affectedUsers,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }