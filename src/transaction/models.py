from django.db import models
import uuid
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
    
    def __str__(self):
        return f"{self.type} - {self.amount}"
