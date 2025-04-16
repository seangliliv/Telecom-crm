from datetime import datetime
from utils.password_hash import hash_password

# Create a Mongo-style User model
class UserModel:
    def __init__(self, data):
        self.email = data["email"]
        self.password = hash_password(data["password"])
        self.firstName = data["firstName"]
        self.lastName = data["lastName"]
        self.role = data["role"]
        self.phoneNumber = data.get("phoneNumber")
        self.profile_image = data.get("profile_image")
        self.status = data["status"]
        self.planId = data.get("planId")
        self.lastActive = data.get("lastActive")
        self.createdAt = datetime.now()
        self.updatedAt = datetime.now()

    def to_dict(self):
        return {
            "email": self.email,
            "password": self.password,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "role": self.role,
            "phoneNumber": self.phoneNumber,
            "profile_image": self.profile_image,
            "status": self.status,
            "planId": self.planId,
            "lastActive": self.lastActive,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
        }
