from django.urls import path
from .views import *
urlpatterns = [
    path('get-auth-url', AuthUrl.as_view()),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('redirect', spotfy_callback),
    path('current-song', CurrentSong.as_view()),
    path('pause-song', PauseSong.as_view()),
    path('play-song', PlaySong.as_view()),
    path('skip-song', SkipSong.as_view())
]
