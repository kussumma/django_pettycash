
import json, base64
from io import BytesIO
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, View
from django.shortcuts import get_object_or_404 
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from location.models import Location
from pymongo import MongoClient
from gridfs import GridFS
from bson.objectid import ObjectId
from django.conf import settings

from .models import PurchaseCategory, PettyCashTransaction
from pettycash_account.models import PettyCashAccount



client = MongoClient(settings.MONGO_HOST)
db = client[settings.MONGO_DB]
fs = GridFS(db)


class TransactionView(LoginRequiredMixin, TemplateView):
    template_name = 'transaction/index.html'


class TransactionAjaxView(LoginRequiredMixin, View):

    def get(self, request, id=None):
        if request.method == 'GET':
            if id is not None:
                transaction = get_object_or_404(PettyCashTransaction, pk=id)
                try:
                    file_id = transaction.receipt
                    if file_id:
                        file = fs.get(ObjectId(file_id))
                        encoded_string = base64.b64encode(file.read()).decode('utf-8')
                    else:
                        encoded_string = None

                    transaction_data = {
                        'id': str(transaction.id),
                        'date': transaction.date.strftime('%Y-%m-%d'),
                        'amount': str(transaction.amount),
                        'description': transaction.description,
                        'type': transaction.type,
                        'account': str(transaction.account.id),
                        'category': str(transaction.category.id),
                        'user': str(transaction.user.pk),
                        'location': str(transaction.location.id),
                        'receipt': encoded_string,
                    }
                    return JsonResponse({'status': 'success', 'data': transaction_data})
                except Exception as e:
                    return JsonResponse({'status': 'false', 'message': str(e)})
            else:
                transaction_data = PettyCashTransaction.objects.values('id', 'date', 'amount', 'description', 'type', 'account__name', 'category__name', 'user__username', 'location__site', 'receipt')

                for transaction in transaction_data:
                    file_id = transaction['receipt']
                    if file_id:
                        file = fs.get(ObjectId(file_id))
                        transaction['receipt'] = base64.b64encode(file.read()).decode('utf-8')

                return JsonResponse(list(transaction_data), safe=False)
    
    @csrf_exempt
    def post(self, request):
        if request.method == 'POST':
            date = request.POST.get('date')
            amount = request.POST.get('amount')
            description = request.POST.get('description')
            type = request.POST.get('type')
            account_id = request.POST.get('account')
            category_id = request.POST.get('category')
            location_id = request.POST.get('location')
            user_id = request.POST.get('user')
            receipt = request.FILES.get('receipt')

            if date and amount and description and type and account_id and category_id and user_id and location_id:
                try:
                    account = PettyCashAccount.objects.get(id=account_id)
                except PettyCashAccount.DoesNotExist as e:
                    return JsonResponse({'status': 'failed', 'message': str(e)})

                try:
                    category = PurchaseCategory.objects.get(id=category_id)
                except PurchaseCategory.DoesNotExist as e:
                    return JsonResponse({'status': 'failed', 'message': str(e)})
                
                try:
                    user = User.objects.get(id=user_id)
                except User.DoesNotExist as e:
                    return JsonResponse({'status': 'failed', 'message': str(e)})

                try:
                    location = Location.objects.get(id=location_id)
                except Location.DoesNotExist as e:
                    return JsonResponse({'status': 'failed', 'message': str(e)})

                parsed_amount = int(float(amount.replace('.', '')))
                amount = parsed_amount

                if receipt:
                    try:
                        file = BytesIO(receipt.read())
                        receipt = fs.put(file)
                    except Exception as e:
                        return JsonResponse({'status': 'failed', 'message': str(e)})

                PettyCashTransaction.objects.create(
                    date=date,
                    amount=amount,
                    description=description,
                    type=type,
                    account=account,
                    category=category,
                    user=user,
                    location=location,
                    receipt=receipt,
                )
                return JsonResponse({'status': 'success', 'message': 'Data berhasil ditambahkan'})
            else:
                return JsonResponse({'status': 'failed', 'message': 'Data tidak boleh kosong'})


    @csrf_exempt
    def delete(self, request):
        if request.method == 'DELETE':
            data = json.loads(request.body)
            transaction_id = data['id']
            transaction = PettyCashTransaction.objects.get(id=transaction_id)
            if transaction:
                transaction.delete()
                return JsonResponse({'status': 'success', 'message': 'Data berhasil dihapus'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Data gagal dihapus'})

class TransactionAjaxUpdate(LoginRequiredMixin, View):
    @csrf_exempt
    def post(self, request):
        if request.method == 'POST':

            date = request.POST.get('date')
            amount = request.POST.get('amount')
            description = request.POST.get('description')
            type = request.POST.get('type')
            account_id = request.POST.get('account')
            category_id = request.POST.get('category')
            location_id = request.POST.get('location')
            user_id = request.POST.get('user')
            receipt = request.FILES.get('receipt')
            transaction_id = request.POST.get('id')

            try:
                transaction = PettyCashTransaction.objects.get(id=transaction_id)
            except PettyCashTransaction.DoesNotExist as e:
                return JsonResponse({'status': 'failed','message': str(e)})

            try:
                transaction = PettyCashTransaction.objects.get(id=transaction_id)
            except PettyCashTransaction.DoesNotExist as e:
                return JsonResponse({'status': 'failed','message': str(e)})

            try:
                account = PettyCashAccount.objects.get(id=account_id)
            except PettyCashAccount.DoesNotExist as e:
                return JsonResponse({'status': 'failed','message': str(e)})

            try:
                category = PurchaseCategory.objects.get(id=category_id)
            except PurchaseCategory.DoesNotExist as e:
                return JsonResponse({'status': 'failed','message': str(e)})

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist as e:
                return JsonResponse({'status': 'failed','message': str(e)})

            try:
                location = Location.objects.get(id=location_id)
            except Location.DoesNotExist as e:
                return JsonResponse({'status': 'failed','message': str(e)})

            parsed_amount = int(float(amount.replace('.', '')))
            amount = parsed_amount

            if receipt:
                try:
                    file = BytesIO(receipt.read())
                    receipt = fs.put(file)
                except Exception as e:
                    return JsonResponse({'status': 'failed', 'message': str(e)})
            
            if transaction:
                transaction.date = date
                transaction.amount = amount
                transaction.description = description
                transaction.type = type
                transaction.account = account
                transaction.category = category
                transaction.user = user
                transaction.location = location
                transaction.receipt = receipt
                
                transaction.save()
                return JsonResponse({'status': 'success', 'message': 'Data berhasil diedit'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Data tidak dapat diedit'})

class PurchaseCategoryAjaxView(LoginRequiredMixin, View):

    def get(self, request):
        if request.method == 'GET':
            category = PurchaseCategory.objects.values()
            return JsonResponse({'status': 'success', 'data': list(category)})