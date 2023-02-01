from django.urls import path
from .views import DashboardView, NotificationView, PettyCashSummaryView, PettyCashChartDataView, PieExpenseByAccountView, ExpensePerCityView

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('notification/', NotificationView.as_view(), name='notifications'),
    path('dashboard/ajax/summary/<int:year>/', PettyCashSummaryView.as_view(), name='pettycash-summary'),
    path('dashboard/ajax/bar/<int:year>/', PettyCashChartDataView.as_view(), name='pettycash-bar'),
    path('dashboard/ajax/pie-account/<int:year>/', PieExpenseByAccountView.as_view(), name='pettycash-pie-account'),
    path('dashboard/ajax/pie-site/<int:year>/', ExpensePerCityView.as_view(), name='pettycash-pie-site'),
]