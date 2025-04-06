from django.db import models

class IssueComment(models.Model):
    issue_id = models.CharField(max_length=255)  
    text = models.TextField()
    user_id = models.CharField(max_length=255)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by User {self.user_id} on Issue {self.issue_id}"
