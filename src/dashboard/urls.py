from django.urls import path
from .views import DashboardView, NotificationView

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('notification/', NotificationView.as_view(), name='notifications'),
]