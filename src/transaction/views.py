
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, View
from django.shortcuts import get_object_or_404 
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from location.models import Location
from pettycash_account.models import PettyCashAccount

from .models import PurchaseCategory, PettyCashTransaction

class TransactionView(LoginRequiredMixin, TemplateView):
    template_name = 'transaction/index.html'

class TransactionAjaxView(LoginRequiredMixin, View):

    def get(self, request, id=None):
        if request.method == 'GET':
            if id is not None:
                transaction = get_object_or_404(PettyCashTransaction, pk=id)
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
                }
                return JsonResponse({'status': 'success', 'data': transaction_data})
            else:
                transaction_data = PettyCashTransaction.objects.values('id', 'date', 'amount', 'description', 'type', 'account__name', 'category__name', 'user__username', 'location__site')
                return JsonResponse(list(transaction_data), safe=False)
    
    @csrf_exempt
    def post(self, request):
        if request.method == 'POST':
            data = json.loads(request.body)
            if data['date'] != '' and data['amount'] != '' and data['description'] != '' and data['type'] != '' and data['account'] != '' and data['category'] != '' and data['user'] != '' and data['location'] != '':
                try:

                    try:
                        account = PettyCashAccount.objects.get(id=data['account'])
                    except PettyCashAccount.DoesNotExist as e:
                        return JsonResponse({'message': str(e)})

                    try:
                        category = PurchaseCategory.objects.get(id=data['category'])
                    except PurchaseCategory.DoesNotExist as e:
                        return JsonResponse({'message': str(e)})
                    
                    try:
                        user = User.objects.get(id=data['user'])
                    except User.DoesNotExist as e:
                        return JsonResponse({'message': str(e)})

                    try:
                        location = Location.objects.get(id=data['location'])
                    except Location.DoesNotExist as e:
                        return JsonResponse({'message': str(e)})

                    parsed_amount = int(float(data['amount'].replace('.', '')))
                    data['amount'] = parsed_amount

                    PettyCashTransaction.objects.create(
                        date=data['date'],
                        amount=data['amount'],
                        description=data['description'],
                        type=data['type'],
                        account=account,
                        category=category,
                        user=user,
                        location=location
                    )
                    return JsonResponse({'status': 'success', 'message': 'Data berhasil ditambahkan'})
                except Exception as e:
                    return JsonResponse({'status': 'failed', 'message': 'Data gagal ditambahkan'})
            else:
                return JsonResponse({'status': 'failed', 'message': 'Data tidak boleh kosong'})

    @csrf_exempt
    def put(self, request):
        if request.method == 'PUT':
            data = json.loads(request.body)

            transaction_id = data['id']
            transaction = PettyCashTransaction.objects.get(id=transaction_id)

            try:
                account = PettyCashAccount.objects.get(id=data['account'])
            except PettyCashAccount.DoesNotExist as e:
                return JsonResponse({'message': str(e)})

            try:
                category = PurchaseCategory.objects.get(id=data['category'])
            except PurchaseCategory.DoesNotExist as e:
                return JsonResponse({'message': str(e)})

            try:
                user = User.objects.get(id=data['user'])
            except User.DoesNotExist as e:
                return JsonResponse({'message': str(e)})

            try:
                location = Location.objects.get(id=data['location'])
            except Location.DoesNotExist as e:
                return JsonResponse({'message': str(e)})

            parsed_amount = int(float(data['amount'].replace('.', '')))
            data['amount'] = parsed_amount
            
            if transaction:
                transaction.date = data['date']
                transaction.amount = data['amount']
                transaction.description = data['description']
                transaction.type = data['type']
                transaction.account = account
                transaction.category = category
                transaction.user = user
                transaction.location = location
                
                transaction.save()
                return JsonResponse({'status': 'success', 'message': 'Data berhasil diedit'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Data tidak dapat diedit'})

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

class PurchaseCategoryAjaxView(LoginRequiredMixin, View):

    def get(self, request):
        if request.method == 'GET':
            category = PurchaseCategory.objects.values()
            return JsonResponse({'status': 'success', 'data': list(category)})