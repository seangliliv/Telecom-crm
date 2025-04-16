# payment_methods/models.py
from datetime import datetime
from bson import ObjectId

class PaymentMethodModel:
    def __init__(self, data):
        self.customerId = data.get("customerId")
        self.type = data.get("type")  # "credit_card", "bank_account"
        self.cardType = data.get("cardType", None)  # "visa", "mastercard", etc.
        self.lastFour = data.get("lastFour")
        self.expiryDate = data.get("expiryDate", None)  # "MM/YY" for credit cards
        self.isDefault = data.get("isDefault", False)
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def to_dict(self):
        return {
            "customerId": self.customerId,
            "type": self.type,
            "cardType": self.cardType,
            "lastFour": self.lastFour,
            "expiryDate": self.expiryDate,
            "isDefault": self.isDefault,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }
