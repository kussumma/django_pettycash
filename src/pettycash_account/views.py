
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, View
from django.shortcuts import get_object_or_404 
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import PettyCashAccount, PettyCashGroup

class PettycashAccountView(LoginRequiredMixin, TemplateView):
    template_name = 'pettycash_account/index.html'

class PettycashAjaxView(LoginRequiredMixin, View):

    def get(self, request, id=None):
        if request.method == 'GET':

            if id is not None:

                pc_account = get_object_or_404(PettyCashAccount, pk=id)
                pc_account_data = {
                    'id': pc_account.id,
                    'name': pc_account.name,
                    'balance': pc_account.balance,
                    'description': pc_account.description,
                    'group': pc_account.group.id
                }
                return JsonResponse({'status': 'success', 'data': pc_account_data})
            else:
                pc_account_data = PettyCashAccount.objects.values('id', 'name', 'balance', 'description', 'group__name')
                return JsonResponse(list(pc_account_data), safe=False)
    
    @csrf_exempt
    def post(self, request):
        if request.method == 'POST':
            data = json.loads(request.body)
            if data['name'] != '' and data['balance'] != '' and data['description'] != '' and data['group'] != '':
                try:
                    try:
                        group = PettyCashGroup.objects.get(id=data['group'])
                    except PettyCashGroup.DoesNotExist as e:
                        return JsonResponse({'message': str(e)})

                    parsed_balance = int(float(data['balance'].replace('.', '')))
                    data['balance'] = parsed_balance

                    PettyCashAccount.objects.create(
                        name=data['name'],
                        balance= data['balance'],
                        description=data['description'],
                        group=group,
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
            pcacctount_id = data['id']
            pettycash_account = PettyCashAccount.objects.get(id=pcacctount_id)

            try:
                group = PettyCashGroup.objects.get(id=data['group'])
            except PettyCashGroup.DoesNotExist as e:
                return JsonResponse({'message': str(e)})

            parsed_balance = int(float(data['balance'].replace('.', '')))
            data['balance'] = parsed_balance
            
            if pettycash_account:
                pettycash_account.name = data['name']
                pettycash_account.balance = data['balance']
                pettycash_account.description = data['description']
                pettycash_account.group = group

                pettycash_account.save()
                return JsonResponse({'status': 'success', 'message': 'Data berhasil diedit'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Data tidak dapat diedit'})

    @csrf_exempt
    def delete(self, request):
        if request.method == 'DELETE':
            data = json.loads(request.body)
            pcacctount_id = data['id']
            pettycash_account = PettyCashAccount.objects.get(id=pcacctount_id)
            if pettycash_account:
                pettycash_account.delete()
                return JsonResponse({'status': 'success', 'message': 'Data berhasil dihapus'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Data gagal dihapus'})

class PettycashGroupAjaxView(LoginRequiredMixin, View):

    def get(self, request):
        if request.method == 'GET':
            pc_account_data = PettyCashGroup.objects.values()
            return JsonResponse({'status': 'success', 'data': list(pc_account_data)})