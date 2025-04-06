from django.db import models

from django.contrib.auth.models import AbstractUser

class SimpleUser(AbstractUser):
    # You can add custom fields here if needed
    groups = models.ManyToManyField(
        'auth.Group', 
        related_name='simpleuser_set',  # Change this name to avoid conflict
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', 
        related_name='simpleuser_permissions',  # Change this name to avoid conflict
        blank=True
    )
