from datetime import timedelta
from django.http import response
from django.utils import timezone
from requests import post
from .models import SpotfyToken
from .creadentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID

spotify_api = 'https://accounts.spotify.com/api/token'

def get_user_tokens(session_key):
    user_tokens = SpotfyToken.objects.filter(user=session_key)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_key, access_token, refresh_token, token_type, expires_in):
    tokens = get_user_tokens(session_key)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.save(update_fields=['access_token', 'refresh_token', 'token_type', 'expires_in'])
    else:
        tokens = SpotfyToken(
            user=session_key,
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
            expires_in=expires_in)
        tokens.save()

def is_spotfy_authenticated(session_key):
    tokens = get_user_tokens(session_key)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotfy_token(session_key)

        return True
        
    return False

def refresh_spotfy_token(session_key):
    refresh_token = get_user_tokens(session_key).refresh_token

    response = post(spotify_api, data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    refresh_token = response.get('refresh_token')

    update_or_create_user_tokens(session_key, access_token, refresh_token, token_type, expires_in)
