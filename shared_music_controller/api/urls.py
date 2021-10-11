from django.urls import path
from .views import CreateRoomView, RoomView

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view())
]