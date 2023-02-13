from django.urls import path
from .views import WeeklyReportAjaxView, ReportView, MonthlyReportAjaxView

urlpatterns = [
    path("", ReportView.as_view(), name="report"),
    path("week-report/<int:year>/<int:month>/<int:day>/", WeeklyReportAjaxView.as_view(), name="week_report"),
    path("month-report/<int:year>/<int:month>/<int:day>/", MonthlyReportAjaxView.as_view(), name="month_report"),
]