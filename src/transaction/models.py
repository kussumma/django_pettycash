from django.db import models
import uuid
import json
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from pettycash_account.models import PettyCashAccount
from django.contrib.auth.models import User
from location.models import Location

class PurchaseCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255, null=False)
    description = models.CharField(max_length=255, null=False)

    def __str__(self):
        return self.name

class PettyCashTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.DateField()
    amount = models.IntegerField(blank=False, null=False)
    description = models.CharField(max_length=255)
    type = models.CharField(max_length=255, choices=[('income', 'Income'), ('expense', 'Expense')])
    account = models.ForeignKey(PettyCashAccount, on_delete=models.CASCADE)
    category = models.ForeignKey(PurchaseCategory, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    receipt = models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f"{self.type} - {self.amount}"


@receiver(post_save, sender=PettyCashTransaction)
def notify_users(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "notifications", {
                "type": "notify",
                "message": f"New transaction has been added",
                "data": json.dumps({
                    "id": str(instance.id),
                    "date": instance.date,
                    "amount": instance.amount,
                    "description": instance.description,
                    "type": instance.type,
                    "account": instance.account.name,
                    "category": instance.category.name,
                    "user": instance.user.username,
                    "location": instance.location.site
                })
            }
        )