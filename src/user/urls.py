from django.urls import path
from .views import UserAjaxView, ProfileView, ProfileAjaxView

urlpatterns = [
    path('', ProfileView.as_view(), name='profile'),
    path('ajax/get', UserAjaxView.as_view(), name='user_ajax_list'),
    path('ajax/profile', ProfileAjaxView.as_view(), name='user_ajax_profile'),
]