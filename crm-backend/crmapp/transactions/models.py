from datetime import datetime
from bson import ObjectId

class TransactionModel:
    def __init__(self, data):
        self.customerId = data.get("customerId")
        self.invoiceId = data.get("invoiceId", None)  # Optional if not related to an invoice
        self.amount = data.get("amount")
        self.type = data.get("type")  # "payment", "refund", "topup"
        self.status = data.get("status")  # "completed", "pending", "failed", "reversed"
        self.paymentMethod = data.get("paymentMethod", {})
        self.date = data.get("date", datetime.utcnow())
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def to_dict(self):
        return {
            "customerId": self.customerId,
            "invoiceId": self.invoiceId,
            "amount": self.amount,
            "type": self.type,
            "status": self.status,
            "paymentMethod": self.paymentMethod,
            "date": self.date,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }