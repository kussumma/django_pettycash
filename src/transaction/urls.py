from django.urls import path
from .views import TransactionView, TransactionAjaxView, TransactionAjaxUpdate, PurchaseCategoryAjaxView

urlpatterns = [
    path('', TransactionView.as_view(), name='transaction'),
    path('ajax/get', TransactionAjaxView.as_view(), name='transaction_ajax_list'),
    path('ajax/post', TransactionAjaxView.as_view(), name='transaction_ajax_post'),
    path('ajax/get/<uuid:id>', TransactionAjaxView.as_view(), name='transaction_ajax_byid'),
    path('ajax/update', TransactionAjaxUpdate.as_view(), name='transaction_ajax_update'),
    path('ajax/delete', TransactionAjaxView.as_view(), name='transaction_ajax_delete'),
    path('ajax/get/category', PurchaseCategoryAjaxView.as_view(), name='transaction_ajax_category'),
]