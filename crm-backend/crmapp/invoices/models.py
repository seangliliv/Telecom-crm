
from datetime import datetime

class InvoiceModel:
    def __init__(self, data):
        self.customerId = data["customerId"]
        self.subscriptionId = data["subscriptionId"]
        self.amount = data["amount"]
        self.status = data["status"]
        self.issueDate = data["issueDate"]
        self.dueDate = data["dueDate"]
        self.paidDate = data.get("paidDate")
        self.items = data.get("items", [])
        self.paymentMethod = data.get("paymentMethod")
        self.createdAt = datetime.now()
        self.updatedAt = datetime.now()

    def to_dict(self):
        return {
            "customerId": self.customerId,
            "subscriptionId": self.subscriptionId,
            "amount": self.amount,
            "status": self.status,
            "issueDate": self.issueDate,
            "dueDate": self.dueDate,
            "paidDate": self.paidDate,
            "items": self.items,
            "paymentMethod": self.paymentMethod,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }
