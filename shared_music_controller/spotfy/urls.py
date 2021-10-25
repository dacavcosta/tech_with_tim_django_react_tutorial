from django.urls import path
from .views import *
urlpatterns = [
    path('get-auth-url', AuthUrl.as_view()),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('redirect', spotfy_callback),
    path('current-song', CurrentSong.as_view())
]
