from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Sum
from django.views import View
from django.http import JsonResponse

from pettycash_account.models import PettyCashAccount
from transaction.models import PettyCashTransaction


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/index.html'

class NotificationView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/notification.html'

class PettyCashSummaryView(View):
    def get(self, request, year):
        total_income = PettyCashTransaction.objects.filter(
            type='income', date__year=year
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        total_expense = PettyCashTransaction.objects.filter(
            type='expense', date__year=year
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        total_balance = PettyCashAccount.objects.aggregate(Sum('balance'))['balance__sum'] or 0

        opening_balance = total_balance - total_income + total_expense

        closing_balance = opening_balance + total_income - total_expense

        context = {
            'total_income': total_income,
            'total_expense': total_expense,
            'opening_balance': opening_balance,
            'closing_balance': closing_balance,
        }

        return JsonResponse(context)
