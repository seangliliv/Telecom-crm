from datetime import datetime

class SubscriptionModel:
    def __init__(self, data):
        self.customerId = data["customerId"]
        self.planId = data["planId"]
        self.status = data["status"]
        self.startDate = data["startDate"]
        self.endDate = data["endDate"]
        self.autoRenew = data["autoRenew"]
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def to_dict(self):
        return {
            "customerId": self.customerId,
            "planId": self.planId,
            "status": self.status,
            "startDate": self.startDate,
            "endDate": self.endDate,
            "autoRenew": self.autoRenew,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }

