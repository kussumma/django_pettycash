from django.db import models
import uuid

class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    city = models.CharField(max_length=255, blank=False, null=False)
    area = models.CharField(max_length=255, blank=False, null=False)
    site = models.CharField(max_length=255, blank=False, null=False)
    address = models.CharField(max_length=255, blank=False, null=False)
    description = models.CharField(max_length=255, blank=False, null=False)

    def __str__(self):
        return f"{self.city}, {self.area}, {self.site}, {self.address}, {self.description}"
