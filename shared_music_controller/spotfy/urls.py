from django.urls import path
from .views import AuthUrl, IsAuthenticated, spotfy_callback

urlpatterns = [
    path('get-auth-url', AuthUrl.as_view()),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('redirect', spotfy_callback)
]
