import uuid
from django.db import models

class PettyCashGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.CharField(max_length=255, blank=False, null=False)

    def __str__(self):
        return self.name

class PettyCashAccount(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=False, null=False)
    balance = models.IntegerField(blank=False, null=False)
    description = models.CharField(max_length=255, blank=False, null=False)
    group = models.ForeignKey(PettyCashGroup, on_delete=models.CASCADE)

    def __str__(self):
        return self.name