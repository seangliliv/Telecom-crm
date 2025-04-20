from datetime import datetime
from bson import ObjectId

class CustomerModel:
    def __init__(self, data):
        self.firstName = data["firstName"]
        self.lastName = data["lastName"]
        self.email = data["email"]
        self.phoneNumber = data["phoneNumber"]
        self.userId = ObjectId(data["userId"]) if data.get("userId") else None
        self.address = {
            "street": data.get("address", {}).get("street", ""),
            "city": data.get("address", {}).get("city", ""),
            "state": data.get("address", {}).get("state", ""),
            "postalCode": data.get("address", {}).get("postalCode", ""),
            "country": data.get("address", {}).get("country", "")
        }
        self.currentPlan = {
            "planId": ObjectId(data.get("currentPlan", {}).get("planId")) if data.get("currentPlan", {}).get("planId") else None,
            "startDate": data.get("currentPlan", {}).get("startDate"),
            "endDate": data.get("currentPlan", {}).get("endDate"),
            "autoRenew": data.get("currentPlan", {}).get("autoRenew", False)
        }
        self.balance = data.get("balance", 0.0)
        self.status = data.get("status", "active")
        self.createdAt = datetime.now()
        self.updatedAt = datetime.now()

    def to_dict(self):
        return {
            "firstName": self.firstName,
            "lastName": self.lastName,
            "email": self.email,
            "phoneNumber": self.phoneNumber,
            "userId": self.userId,
            "address": self.address,
            "currentPlan": self.currentPlan,
            "balance": self.balance,
            "status": self.status,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }