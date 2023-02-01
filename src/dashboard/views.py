from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Sum
from django.views import View
from django.http import JsonResponse
from django.db.models.functions import TruncMonth

from pettycash_account.models import PettyCashAccount
from transaction.models import PettyCashTransaction
from location.models import Location


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

class PettyCashChartDataView(View):
    def get(self, request, year):
        months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ]

        total_income = PettyCashTransaction.objects.filter(
            type='income', date__year=year
        ).annotate(month=TruncMonth('date')).values('month').annotate(income=Sum('amount'))

        total_expense = PettyCashTransaction.objects.filter(
            type='expense', date__year=year
        ).annotate(month=TruncMonth('date')).values('month').annotate(expense=Sum('amount'))

        data = {
            'series': [{
                'name': 'Income',
                'data': [
                    next((i['income'] for i in total_income if i['month'].strftime("%b") == m), 0)
                    for m in months
                ]
            }, {
                'name': 'Expense',
                'data': [
                    next((i['expense'] for i in total_expense if i['month'].strftime("%b") == m), 0)
                    for m in months
                ]
            }],
            'categories': months
        }

        return JsonResponse(data)

class PieExpenseByAccountView(View):
    def get(self, request, *args, **kwargs):
        year = kwargs.get('year')
        transactions = PettyCashTransaction.objects.filter(date__year=year, type='expense')
        accounts = {}
        for transaction in transactions:
            if transaction.account.name in accounts:
                accounts[transaction.account.name] += transaction.amount
            else:
                accounts[transaction.account.name] = transaction.amount

        data = {
            'series': [],
            'labels': []
        }
        for account_name, amount in accounts.items():
            data['labels'].append(account_name)
            data['series'].append(amount)

        return JsonResponse(data)

class ExpensePerCityView(View):
    def get(self, request, year, *args, **kwargs):
        transactions = PettyCashTransaction.objects.filter(
            type='expense',
            date__year=year
        )
        locations = Location.objects.all()
        city_expenses = {}
        for location in locations:
            city_expenses[location.site] = 0
        
        for transaction in transactions:
            city_expenses[transaction.location.site] += transaction.amount
        
        data = {
            'series': list(city_expenses.values()),
            'labels': list(city_expenses.keys())
        }
        
        return JsonResponse(data)