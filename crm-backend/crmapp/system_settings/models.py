# system_settings/models.py
from datetime import datetime
from bson import ObjectId

class SystemSettingsModel:
    def __init__(self, data):
        self.category = data.get("category")  # "general", "email", "security", "backup"
        self.settings = data.get("settings", {})  # Flexible structure based on category
        self.updatedBy = data.get("updatedBy")  # Reference to the admin who updated settings
        self.createdAt = datetime.utcnow()
        self.updatedAt = datetime.utcnow()

    def to_dict(self):
        return {
            "category": self.category,
            "settings": self.settings,
            "updatedBy": self.updatedBy,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }