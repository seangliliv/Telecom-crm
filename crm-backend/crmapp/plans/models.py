from datetime import datetime
from bson import ObjectId


class PlanModel:
    def __init__(self, data):
        self.name = data["name"]
        self.description = data["description"]
        self.price = data["price"]
        self.billingCycle = data["billingCycle"]
        self.features = {
            "data": data["features"]["data"],
            "calls": data["features"]["calls"],
            "sms": data["features"]["sms"],
            "speed": data["features"]["speed"]
        }
        self.status = data["status"]
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "billingCycle": self.billingCycle,
            "features": self.features,
            "status": self.status,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }
