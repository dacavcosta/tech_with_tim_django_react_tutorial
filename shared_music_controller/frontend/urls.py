from django.urls import path
from .views import  index

urlpatterns = [
    path('', index),
    path('room/<str:roomCode>', index),
    path('create', index),
    path('join', index)
]