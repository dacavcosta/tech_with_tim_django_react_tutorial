from django.shortcuts import redirect, render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from requests import Request, post
from .creadentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from .utils import is_spotfy_authenticated, spotify_api, update_or_create_user_tokens

class AuthUrl(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

    def spotfy_callback(request, format=None):
        code = request.Get.get('code')
        error = request.Get.get('error')

        response = post(spotify_api, data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }).json()

        access_token = response.get('access_token')
        token_type = response.get('token_type')
        refresh_token = response.get('refresh_token')
        expires_in = response.get('expires_in')
        error = response.get('error')

        if not request.session.exists(request.session.session_key):
            request.session.create()

        update_or_create_user_tokens(
            request.session.session_key, access_token, refresh_token, token_type, expires_in)
        
        return redirect('frontend:')
    
class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_autenticated = is_spotfy_authenticated(self.request.session.session_key)
        return Response({'status': is_autenticated}, status=status.HTTP_200_OK)