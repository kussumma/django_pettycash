from django.urls import path
from .views import LocationView, LocationAjaxView

urlpatterns = [
    path('', LocationView.as_view(), name='location'),
    path('ajax/get', LocationAjaxView.as_view(), name='location_ajax_list'),
    path('ajax/post', LocationAjaxView.as_view(), name='location_ajax_post'),
    path('ajax/get/<uuid:id>', LocationAjaxView.as_view(), name='location_ajax_byid'),
    path('ajax/update', LocationAjaxView.as_view(), name='location_ajax_update'),
    path('ajax/delete', LocationAjaxView.as_view(), name='location_ajax_delete'),

]