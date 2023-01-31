from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/index.html'

class NotificationView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/notification.html'

