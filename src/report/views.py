
from django.views.generic import TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.db.models import Sum

from datetime import datetime, timedelta
import calendar
from transaction.models import PettyCashTransaction


class ReportView(LoginRequiredMixin, TemplateView):
    template_name = 'report/index.html'

class WeeklyReportAjaxView(LoginRequiredMixin, View):

    def get_week_transactions(self, id, week_start, week_end):
        if id == '':
            transactions = PettyCashTransaction.objects.filter(
                date__gte=week_start, date__lte=week_end
            ).order_by("date")
        else:
            transactions = PettyCashTransaction.objects.filter(
                date__gte=week_start, date__lte=week_end, account_id=id
            ).order_by("date")

        return transactions
    
    def get_week_totals(self, transactions):
        income_total = 0
        expense_total = 0
        for transaction in transactions:
            if transaction.type == "income":
                income_total += transaction.amount
            elif transaction.type == "expense":
                expense_total += transaction.amount
        return income_total, expense_total

    def generate_week_report(self, id, week_start, week_end):
        transactions = self.get_week_transactions(id, week_start, week_end)
        income_total, expense_total = self.get_week_totals(transactions)

        if id == '':
            opening_balance = transactions.aggregate(Sum('account__balance'))['account__balance__sum'] or 0
        else:
            opening_balance = transactions.first().account.balance

        report = {
            "transactions": list(transactions.values("id", "date", "amount", "description", "type", "account__name", "category__name", "user__username", "location__site")),
            "transactions_count": transactions.count(),
            "income_total": income_total,
            "expense_total": expense_total,
            "opening_balance": opening_balance,
            "closing_balance": opening_balance + income_total - expense_total,
            "period": f"{week_start.strftime('%d %b %Y')} - {week_end.strftime('%d %b %Y')}",
        }
        return report

    def get(self, request, year, month, day):
        id = request.GET.get("id")
        date = datetime(year, month, day)
        week_start = date.date() - timedelta(days=date.weekday())

        week_end = week_start + timedelta(days=6)

        try:
            report = self.generate_week_report(id, week_start, week_end)
            return JsonResponse({'data': report, 'status': 'success'})
        except Exception as e:
            return JsonResponse({"status": 'Data not found'})


class MonthlyReportAjaxView(LoginRequiredMixin, View):

    def get_month_transactions(self, id, month_start, month_end):
        if id == '':
            transactions = PettyCashTransaction.objects.filter(
                date__gte=month_start, date__lte=month_end
            ).order_by("date")
        else:
            transactions = PettyCashTransaction.objects.filter(
                date__gte=month_start, date__lte=month_end, account_id=id
            ).order_by("date")

        return transactions
    
    def get_month_totals(self, transactions):
        income_total = 0
        expense_total = 0
        for transaction in transactions:
            if transaction.type == "income":
                income_total += transaction.amount
            elif transaction.type == "expense":
                expense_total += transaction.amount
        return income_total, expense_total

    def generate_month_report(self, id, month_start, month_end):
        transactions = self.get_month_transactions(id, month_start, month_end)
        income_total, expense_total = self.get_month_totals(transactions)

        if id == '':
            opening_balance = transactions.aggregate(Sum('account__balance'))['account__balance__sum'] or 0
        else:
            opening_balance = transactions.first().account.balance

        report = {
            "transactions": list(transactions.values("id", "date", "amount", "description", "type", "account__name", "category__name", "user__username", "location__site")),
            "transactions_count": transactions.count(),
            "income_total": income_total,
            "expense_total": expense_total,
            "opening_balance": opening_balance,
            "closing_balance": opening_balance + income_total - expense_total,
            "period": f"{month_start.strftime('%d %b %Y')} - {month_end.strftime('%d %b %Y')}",
        }
        return report

    def get(self, request, year, month, day):
        id = request.GET.get("id")
        month_start = datetime(year, month, 1)
        month_end = datetime(year, month, calendar.monthrange(year, month)[1])

        try:
            report = self.generate_month_report(id, month_start, month_end)
            return JsonResponse({'data': report, 'status': 'success'})
        except Exception as e:
            return JsonResponse({"status": 'Data not found'})
