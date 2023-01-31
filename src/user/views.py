
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView, View
from django.shortcuts import get_object_or_404 
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt


class ProfileView(LoginRequiredMixin, TemplateView):
    template_name = 'user/index.html'

class ProfileAjaxView(LoginRequiredMixin, View):

    def get(self, request):
        if request.method == 'GET':
            user = request.user
            user_data = {
                'id': user.pk,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
            }
            return JsonResponse({'status': 'success', 'data': user_data})

class UserAjaxView(LoginRequiredMixin, View):
    
    def get(self, request, id=None):
        if request.method == 'GET':
            if id is not None:
                user = get_object_or_404(User, pk=id)
                user_data = {
                    'id': user.pk,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                }
                return JsonResponse({'status': 'success', 'data': user_data})
            else:
                user_data = User.objects.values('id', 'username', 'email', 'first_name', 'last_name')
                return JsonResponse(list(user_data), safe=False)

