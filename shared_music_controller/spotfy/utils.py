from datetime import timedelta
from django.http import response
from django.utils import timezone
from requests import get, post, put
from requests.sessions import session
from rest_framework import status
from .models import SpotfyToken
from .creadentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID

BASE_URL = "https://api.spotify.com/v1/me"
TOKEN_URL = "https://accounts.spotify.com/api/token"

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

    response = post(TOKEN_URL, data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(session_key, access_token, refresh_token, token_type, expires_in)

def execute_spotify_api_request(session_key, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_key)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + tokens.access_token}

    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'Error': 'Something went wrong with the request.'}

def pause_song(session_key):
    return execute_spotify_api_request(session_key, "/player/pause", put_=True)

def play_song(session_key):
    return execute_spotify_api_request(session_key, "/player/play", put_=True)

def skip_song(session_key):
    return execute_spotify_api_request(session_key, "/player/next", post_=True)