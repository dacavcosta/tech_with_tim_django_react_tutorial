from django.urls import path
from .views import  index

app_name = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('room/<str:roomCode>', index),
    path('create', index),
    path('info', index),
    path('join', index)
]