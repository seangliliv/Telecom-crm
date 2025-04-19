# model.py
from datetime import datetime
from utils.password_hash import hash_password

class UserModel:
    def __init__(self, data, _id=None):
        """
        data: dict containing at least
          - email, password, firstName, lastName, role, status
          - optional: phoneNumber, profile_image, planId, lastActive
        _id:  optional MongoDB ObjectId (so that to_dict can include it)
        """
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
        """
        Return a plain dict suitable for JSON serialization or DB insertion.
        If self._id is set, include both "_id" and "id" (stringified).
        """
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
            # include the Mongo ObjectId as both _id and id
            base["_id"] = str(self._id)
            base["id"]  = str(self._id)
        return base
