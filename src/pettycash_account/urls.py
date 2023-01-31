from django.urls import path
from .views import PettycashAccountView, PettycashAjaxView, PettycashGroupAjaxView

urlpatterns = [
    path('', PettycashAccountView.as_view(), name='pettycash_account'),
    path('ajax/get', PettycashAjaxView.as_view(), name='pcaccount_ajax_list'),
    path('ajax/post', PettycashAjaxView.as_view(), name='pcaccount_ajax_post'),
    path('ajax/get/<uuid:id>', PettycashAjaxView.as_view(), name='pcaccount_ajax_byid'),
    path('ajax/update', PettycashAjaxView.as_view(), name='pcaccount_ajax_update'),
    path('ajax/delete', PettycashAjaxView.as_view(), name='pcaccount_ajax_delete'),
    path('ajax/get/group', PettycashGroupAjaxView.as_view(), name='pcaccount_ajax_group'),
]