from datetime import datetime
from utils.password_hash import hash_password

class UserModel:
    def __init__(self, data, _id=None):
        # store the id if provided
        self._id = _id

        # required fields
        self.email = data["email"]
        self.password = hash_password(data["password"])
        self.firstName = data["firstName"]
        self.lastName = data["lastName"]
        self.role = data["role"]
        self.status = data["status"]

        # optional
        self.phoneNumber = data.get("phoneNumber")
        self.profile_image = data.get("profile_image")
        self.planId = data.get("planId")
        self.lastActive = data.get("lastActive")

        # timestamps
        now = datetime.utcnow()
        self.createdAt = data.get("createdAt", now)
        self.updatedAt = data.get("updatedAt", now)

    def to_dict(self):
        base = {
            "email": self.email,
            "password": self.password,
            "firstName": self.firstName,
            "lastName": self.lastName,
            "role": self.role,
            "status": self.status,
            "phoneNumber": self.phoneNumber,
            "profile_image": self.profile_image,
            "planId": self.planId,
            "lastActive": self.lastActive,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
        }
        if self._id:
            base["_id"] = str(self._id)
            base["id"]  = str(self._id)
        return base
