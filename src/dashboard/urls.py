from django.urls import path
from .views import DashboardView, NotificationView, PettyCashSummaryView

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('notification/', NotificationView.as_view(), name='notifications'),
    path('dashboard/ajax/summary/<int:year>/', PettyCashSummaryView.as_view(), name='pettycash-summary'),
]