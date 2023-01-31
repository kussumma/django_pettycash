import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, View
from django.shortcuts import get_object_or_404 
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Location

class LocationView(LoginRequiredMixin, TemplateView):
    template_name = 'location/index.html'

class LocationAjaxView(LoginRequiredMixin, View):

    def get(self, request, id=None):
        if request.method == 'GET':

            if id is not None:
                location = get_object_or_404(Location, pk=id)
                location_data = {
                    'id': location.id,
                    'city': location.city,
                    'area': location.area,
                    'site': location.site,
                    'address': location.address,
                    'description': location.description
                }
                return JsonResponse({'status': 'success', 'data': location_data})
            else:
                location_data = Location.objects.values()
                return JsonResponse(list(location_data), safe=False)
    
    @csrf_exempt
    def post(self, request):
        if request.method == 'POST':
            data = json.loads(request.body)
            if data['city'] != '' and data['area'] != '' and data['site'] != '' and data['address'] != '' and data['description'] != '':
                try:
                    Location.objects.create(
                        city=data['city'],
                        area=data['area'],
                        site=data['site'],
                        address=data['address'],
                        description=data['description']
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
            location_id = data['id']
            location = Location.objects.get(id=location_id)
            if location:
                location.city = data['city']
                location.area = data['area']
                location.site = data['site']
                location.address = data['address']
                location.description = data['description']

                location.save()
                return JsonResponse({'status': 'success', 'message': 'Data berhasil diedit'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Data tidak dapat diedit'})

    @csrf_exempt
    def delete(self, request):
        if request.method == 'DELETE':
            data = json.loads(request.body)
            location_id = data['id']
            location = Location.objects.get(id=location_id)
            if location:
                location.delete()
                return JsonResponse({'status': 'success', 'message': 'Data berhasil dihapus'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Data gagal dihapus'})
